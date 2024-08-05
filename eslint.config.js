module.exports = {
  languageOptions: {
    globals: {
      browser: true, // window, alert などのグローバル変数を許可
      node: true, // process など Node.js 環境で使用されるグローバル変数を許可
      es6: true, // ES6 の機能を使用するコードを解析
    },
    parserOptions: {
      ecmaVersion: 'latest', // 最新の ECMAScript バージョンの構文を許可
      sourceType: 'module', // ES6 モジュール（import/export）の構文を使用
    },
  },
  rules: {
    'no-console': ['warn'], // console に関するルールを設定（本番環境では基本残さないので、error 推奨）
    // 'indent': ['error', 2], // インデントのルールを設定
    'semi': ['error', 'always'], // セミコロンのルールを設定
    'no-unused-vars': ['warn'], // var を使用しないように設定。関数スコープではなく、ブロックスコープである let や const が推奨
  },
  // Airbnb など企業が提供するルール設定は、`extends` を使用して導入することができる
};
