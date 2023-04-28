export const convertErrorCode = (code: string) => {
  switch (code) {
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません";
    case "auth/user-not-found":
      return "メールアドレスまたはパスワードが違います";
    case "auth/weak-password":
      return "パスワードは6文字以上にしてください";
    case "auth/wrong-password":
      return "メールアドレスまたはパスワードが違います";
    default:
      return "送信エラーです。";
  }
};
