# Framed Icon Generator [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/zentala/framed-icon-generator)

## 🌍 Overview
Adds rounded border and description around icon. 

I use it to generate labels for my collection of electronic components.

## 🏗 Development & demo
Click `Gitpod` button above to setup development workspace in the Cloud and develop code in your browser. [You can read more about GitPod on the officail website of the project.](https://www.gitpod.io/)

### Usage

``` bash
$ node index --title "relay" --output "relay"
Added title "RELAY" to the icon
Icon saved as relay.png
$
```

You can shorten it to:
``` bash
$ node index -t "relay" -o "relay"
```

OR convert icons in batch:
``` bash
$ node index -b
```

All icons from `icons/input/` will be processed and saved into `icons/output/`.

## Not covered edge cases
* overwriting previously generated icon without prompt

## More
* splitting words in English: https://www.hyphenation24.com/
