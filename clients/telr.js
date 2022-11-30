const qrcode = require('qrcode');
const axios = require('axios');

class Telr {
	#authkey;
	#storeId;
	#authToken;
	#qlApi;
	#getTransApi;

	constructor(authKey, storeId, authToken, creteQLApi, getTransApi) {
		this.#authkey = authKey;
		this.#storeId = storeId;
		this.#qlApi = creteQLApi;
		this.#authToken = authToken;
		this.#getTransApi = getTransApi;
	}

	createQuickLink([date, amount, name]) {
		return new Promise(async (resolve, reject) => {
			const quickLinksData = {
				QuickLinkRequest: {
					StoreID: '',
					AuthKey: '',
					Details: {
						Desc: "",
						Cart: "",
						Currency: "AED",
						Amount: "",
						MinQuantity: "1",
						MaxQuantity: "1",
						FullName: "",
						Addr1: "",
						City: "",
						Country: "RU",
						Email: "",
						Phone: ""
					},
					VariableValueMode: {
						Status: "",
						SectionTitle: ""
					},
					RepeatBilling: {
						Status: "",
						Amount: "",
						Period: "",
						Interval: "",
						Start: "",
						Term: "",
						Final: ""
					},
					Availability: {
						NotValidBefore: {
							Day: "",
							Month: "",
							Year: ""
						},
						NotValidAfter: {
							Day: "",
							Month: "",
							Year: ""
						},
						StockControl: "1",
						StockCount: "5"
					}
				}
			}

			quickLinksData.QuickLinkRequest.StoreID = this.#storeId;
			quickLinksData.QuickLinkRequest.AuthKey = this.#authkey;
			quickLinksData.QuickLinkRequest.Details.Desc = `${date} ${name}`;
			quickLinksData.QuickLinkRequest.Details.Amount = amount;
			quickLinksData.QuickLinkRequest.Details.FullName = name;

			try {
				const request = await axios.post(this.#qlApi, quickLinksData);
				const qrUrl = request.data.QuickLinkResponse.URL;
				resolve(await this.createQRCode(qrUrl));
			}
			catch (e) {
				reject(e);
			}
		});
	}

	createQRCode(qrUrl) {
		return new Promise((resolve, reject) => {
			qrcode.toDataURL(qrUrl, (err, url) => {
				if (err) {
					reject(err);
				}
				const base64Url = url.replace(new RegExp(`.*?${','}(.*)`), '$1');
				resolve({ qrCode: Buffer.from(base64Url, 'base64'), url: qrUrl });
			})
		});
	}

	getTransacionInfo(ref) {
		return new Promise(async (resolve, reject) => {
			try {
				const link = this.#getTransApi + `/${ref}`;
				const _headers = {
					'Authorization': this.#authToken
				}
				const transInfo = await axios.get(link, {
					headers: _headers
				});
				resolve(transInfo.data);
			}
			catch (error) {
				reject(error)
			}
		})
	}

	defineTransactionStatus(code) {
		let status = 'undefined';
		switch (code) {
			case 'A':
				status = 'Успешная оплата';
				break;
			case 'H':
				status = 'Оплата в ожидании';
				break;
			case 'E':
				status = 'Ошибка сервера';
				break;
			default:
				status = 'undefined'
				break;
		}
		return status;
	}
}

module.exports = Telr;
