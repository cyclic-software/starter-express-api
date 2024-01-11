function convertUrl(url) {
    // Thay thế tất cả các backslashes với forward slashes
    let convertedUrl = url.replace(/\\/g, '/');

    // Kiểm tra và thêm 'http://' nếu URL không bắt đầu với 'http://' hoặc 'https://'

    if (!convertedUrl.startsWith('http://') && !convertedUrl.startsWith('https://')) {
        convertedUrl = 'http://' + convertedUrl;
    }

    return convertedUrl;
}
module.exports = convertUrl