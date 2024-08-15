
<h1 align="center">
  <br>
  <a href="https://github.com/alexandermirzoyan/i18n-file-converter"><img src="/images/logo.png" alt="i18n" width="200"></a>
  <br>
  i18n-file-converter
  <br>
</h1>

<h4 align="center">Generate .xlsx files from .json and back with ease</h4>

<p align="center">
  <a href="#key-features">Motivation</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

![screenshot](/images/intro.gif)

## Motivation

Ever faced to a problem when sending i18n file content to a customer for getting translations for the other locales?

We all know the pain when developers like to work with `.json` files but the customers prefer more user-friendly ways to work with them like `.xlsx`

With this library you can easily convert all your `.json` files into `.xlsx` send to a customer and after getting translated file back you can convert it back to `.json` file.


## How To Use

```
# Install the package
$ npm install i18n-file-converter
```

This package comes with two functions `json2xlsx()` and `xlsx2json()`.

Example of generating `.xlsx` file from the `/locales` folder.

```
json2xlsx({
  inputPath: path.resolve(__dirname, '../locales'),
  outputPath: path.resolve(__dirname, `../${GENERATION_FOLDER_NAME}`),
  config: {
    column: { width: 80 },
  },
});
```

Example of generating `.json` files back from `.xlsx` file.

```
xlsx2json({
  inputPath: path.resolve(__dirname, `../${GENERATION_FOLDER_NAME}/locales.xlsx`),
  outputPath: path.resolve(__dirname, `../${GENERATION_FOLDER_NAME}/locales`),
});
```


## Credits

This library is created on top of [xlsx](https://www.npmjs.com/package/xlsx) package.

## License

ISC

---

> GitHub [@alexandermirzoyan](https://github.com/alexandermirzoyan) &nbsp;&middot;&nbsp;
> LinkedIn [@alexandr-mirzoyan](https://linkedin.com/in/alexandr-mirzoyan/)

