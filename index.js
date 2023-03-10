const usb = require("usb");

usb.useUsbDkBackend();

async function lerDispositivoUSB() {
    try {
        const devices = usb.getDeviceList();
        const device = devices[0]; // obtem o primeiro dispositivo da lista

        device.open();

        const endpoint = device.interfaces[0].endpoints[0];
        endpoint.startPoll();

        endpoint.on("data", (data) => {
            console.log("Dados lidos:", data);
        });

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                endpoint.stopPoll();
                resolve();
            }, 5000); // tempo de leitura de 5 segundos
        });

        device.close();
    } catch (error) {
        console.error("Erro ao ler dispositivo USB:", error);
    }
}

lerDispositivoUSB();
