const qrcode = require('qrcode');
const axios = require('axios');

class Telr {
    #authkey;
    #storeId;
	#qlApi;

    constructor(authKey, storeId, creteQLApi){
		this.#authkey = authKey;
		this.#storeId = storeId;
		this.#qlApi = creteQLApi;
        quickLinksData.QuickLinkRequest.StoreID = storeId;
        quickLinksData.QuickLinkRequest.AuthKey = authKey;
    }

    createQuickLink([date, amount, name]) {
      return new Promise(async (resolve, reject) => {
        // Copy QuickLinksData object
        let _qld = JSON.stringify(quickLinksData);
        let qlData = JSON.parse(_qld);
      
        qlData.QuickLinkRequest.Details.Desc = `${date} ${name}`;
        qlData.QuickLinkRequest.Details.Amount = amount;
        qlData.QuickLinkRequest.Details.FullName = name;

        try {
          const request = await axios.post(this.#qlApi, qlData);
          const qrUrl = request.data.QuickLinkResponse.URL;
          resolve (await this.createQRCode(qrUrl));
        } catch(e) {
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
				let base64Url = url.replace(new RegExp(`.*?${','}(.*)`), '$1');
				resolve({qrCode: Buffer.from(base64Url, 'base64'), url: qrUrl});
			})
		});
  }
}

const quickLinksData = {
	"QuickLinkRequest": {
		"StoreID": '',
		"AuthKey": '',
		"Details": {
			"Desc": "",
			"Cart": "",
			"Currency": "AED",
			"Amount": "",
			"MinQuantity": "1",
			"MaxQuantity": "1",
			"FullName": "",
			"Addr1": "",
			"City": "",
			"Country": "RU",
			"Email": "",
			"Phone": ""
		},
		"VariableValueMode": {
			"Status": "",
			"SectionTitle": ""
		},
		"RepeatBilling": {
			"Status": "",
			"Amount": "",
			"Period": "",
			"Interval": "",
			"Start": "",
			"Term": "",
			"Final": ""
		},
		"Availability": {
			"NotValidBefore": {
				"Day": "",
				"Month": "",
				"Year": ""
			},
			"NotValidAfter": {
				"Day": "",
				"Month": "",
				"Year": ""
			},
			"StockControl": "1",
			"StockCount": "5"
		}
	}
}

module.exports = Telr;