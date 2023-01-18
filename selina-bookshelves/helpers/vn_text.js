const get_unaccented_text_vn = (string='') => {
    return string
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
}

const get_accent_insensitive_regex_vn = (string='') => {
    return string
        .replace(/a/g, '[a,ă,â,á,ắ,ấ,à,ằ,ầ,ả,ẳ,ẩ,ã,ẵ,ẫ,ạ,ặ,ậ]')
        .replace(/e/g, '[e,ê,é,ế,è,ề,ẻ,ể,ẽ,ễ,ẹ,ệ]')
        .replace(/i/g, '[i,í,ì,ỉ,ĩ,ị]')
        .replace(/o/g, '[o,ô,ơ,ó,ố,ớ,ò,ồ,ờ,ỏ,ổ,ở,õ,ỗ,ỡ,ọ,ộ,ợ]')
        .replace(/u/g, '[u,ư,ú,ứ,ù,ừ,ủ,ử,ũ,ữ,ụ,ự]')
        .replace(/y/g, '[y,ý,ỳ,ỷ,ỹ,ỵ]')
        .replace(/d/g, '[d,đ]')
}

module.exports = {
    get_unaccented_text_vn,
    get_accent_insensitive_regex_vn
}