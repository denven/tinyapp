//Msg info used to display the bootstrap modal dialog.
//the string message is passed in the template variable by key "msg".

const PWD_NOT_MATCH = `😟: Two passwords does not match each other, type again!`;
const EML_ARD_USED = `🤗: Email has aready been used, try another one.`;
const PWD_NOT_RIGHT = `🤔: Wrong password, try it again.`;
const USR_NOT_EXIST = `😔: Account not exsits in user Database.`;
const SHTURL_NOT_EXIST = `😨: This shortURL does not exist, no Long URL matched!`;
const SHTURL_NO_PERMIT = `😠: This shortURL does not belong to you, cannot redirect!`;
const USR_NOT_LOGIN = `😐: You have not logined in, some information will not show!`;

module.exports = {
  PWD_NOT_MATCH,
  PWD_NOT_RIGHT,
  EML_ARD_USED,
  USR_NOT_EXIST,
  SHTURL_NOT_EXIST,
  SHTURL_NO_PERMIT,
  USR_NOT_LOGIN
};