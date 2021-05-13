module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
        "jsx": true
    }
  },
  "extends": ["taro/react"],
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, {"extensions": [".js", ".jsx", ".tsx"]}]
  },
  "globals": {
    "wx": true,
  },
  "ecmaFeatures": {

  }
}
