<template>
  <div class="signin">
    <h1 class="mainCopy">ログイン</h1>
    <div>
      <form class="form" method="post">
        <div class="form__unit">
          <label>メールアドレス</label>
          <input name="email" type="email" />
        </div>
        <div class="form__unit">
          <label>パスワード</label>
          <input name="password" type="password" />
        </div>
        <button class="form__button" type="submit">ログイン</button>
      </form>
    </div>
  </div>
</template>
<style lang="scss">
.form {
  max-width: 300px;
  margin: 0 auto;
  .form__unit {
    margin-bottom: 24px;
    font-size: 16px;
    label {
      display: block;
      text-align: left;
      margin-bottom: 4px;
    }
    input {
      display: block;
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: solid 1px #000;
    }
  }
}

.form__button {
  display: block;
  max-width: 200px;
  width: 100%;
  margin: 0 auto;
  text-decoration: none;
  border: solid 1px #394867;
  color: #394867;
  padding: 4px 8px;
  border-radius: 8px;
  text-align: center;
  transition-duration: 0.3s;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  background-color: #fff;
  margin-top: 40px;
  &:hover {
    border: solid 1px #212a3e;
    background-color: #212a3e;
    color: #fff;
  }
}
</style>
