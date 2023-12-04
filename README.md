# Framed Icon Generator [![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg)](https://github.com/emersion/stability-badges#experimental) [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/zentala/framed-icon-generator)

## 🌍 Overview
Adds rounded border and description around icon. 

I use it to generate labels for my collection of electronic components.

![Generated sticker icons on my electronic drawers](https://cdn.zentala.io/img/framed/framed_icon.jpg)

# 📝 Limitations in Icon Provision
Unfortunately, I am unable to provide the specific icons I used due to copyright issues. While I can offer the entire code for generating the frames, the icons themselves, essential for a complete product, are missing. If you have ideas for circumventing this, such as creating your own icon set or using open-source electronics icons sets, please feel free to submit your PRs and implement changes. Despite the lack of icons, I still hope to inspire someone in creating something similar.

# 💡 SaaS Business Idea
I often lack the time to realize my business ideas, but there is a substantial business potential in custom sticker generation and developing a SaaS platform to handle user orders and printing. Possible sticker types include:
1) Transparent company logos for equipment marking.
2) Contact information stickers for documents and personal items, aiding in recovery during travels.
3) Electronic icons, similar to what I've created.
4) Icons for smart home buttons, clarifying their functions.
5) Labels for jars and storage containers.

This service seems absent in the market, especially in Poland, and I would be a potential customer, so I could suppose there are others. I dream of building a SaaS application of this kind, so if you're interested in investing in such a venture, contact [Zentala Innovation Agency](http://zentala.agency/), that I created to realize such innovative projects.

# 🖨️ Print Quality
I used a Brother `PT-E550W` printer which offers only 180dpi resolution, resulting in legible but slightly pixelated prints. For professional applications, I recommend a printer with 360dpi resolution, such as the `PT-P900W`, for clearer output. I used 24mm width semi-transparent tape. I strongly recommend these transparent tapes for a seamlessly blending or background-communing effect.

<details>
<summary>Click to see close-up quality of icon prints on a printer with 180dpi resolution</summary>
  
![1.27mm THT pin connectors](https://cdn.zentala.io/img/framed/127mmTHT.jpg)
![7-segment digital display](https://cdn.zentala.io/img/framed/7-seg.digits.jpg)
![AC to DC converters](https://cdn.zentala.io/img/framed/ac.dc.jpg)
![Arduino microcontrollers](https://cdn.zentala.io/img/framed/arduino.jpg)
![ATmega microcontrollers](https://cdn.zentala.io/img/framed/atmega.jpg)
![Audio connectors & accesories](https://cdn.zentala.io/img/framed/audio.jpg)
![Regulated DC to DC converter](https://cdn.zentala.io/img/framed/dc.dc.jpg)
![DC to DC converter](https://cdn.zentala.io/img/framed/dc.dc.2.jpg)
![Various diodes](https://cdn.zentala.io/img/framed/diodes.jpg)
![ESP32 microcontroller modules](https://cdn.zentala.io/img/framed/esp32.jpg)
![ESP8266 Wi-Fi modules](https://cdn.zentala.io/img/framed/esp8266.jpg)
![Jumper cables](https://cdn.zentala.io/img/framed/jumper.cables.jpg)
![R9V battery holders](https://cdn.zentala.io/img/framed/r9.holders.jpg)
![Electrical relays](https://cdn.zentala.io/img/framed/relays.jpg)
![Various resistors](https://cdn.zentala.io/img/framed/resistors.jpg)
![Servo motors](https://cdn.zentala.io/img/framed/servo.jpg)
![Shift registers IC](https://cdn.zentala.io/img/framed/shift.register.jpg)
![Solder masks for PCBs](https://cdn.zentala.io/img/framed/solder.masks.jpg)
<!-- ![IEC 320 C14 power connector](https://cdn.zentala.io/img/framed/iec320.c14.jpg) -->

</details>

## 🏗 Development & demo
Click `Gitpod` button above to setup development workspace in the Cloud and develop code in your browser. 

[You can read more about GitPod on the officail website of the project.](https://www.gitpod.io/)

### Discamler
What you receive is not even an application; it's a script. Using this script requires basic programming knowledge and I provide it as-is, with all its flaws. It should be treated as a handy tool I constructed to expedite the generation of over 50 icons in this particular style, not as an application ready for immediate use. Do not expect it to work out of the box or to achieve similar effects without significant effort in preparing icons and adjusting it to your needs. Consider this an inspiration.


### Tech Stack

![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white) 
![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) 
![Gitpod](https://img.shields.io/badge/-Gitpod-1A1F71?logo=gitpod&logoColor=white) 
![gitignore](https://img.shields.io/badge/-gitignore.io-204ECF?logo=gitignoredotio&logoColor=white) 
![EditorConfig](https://img.shields.io/badge/-EditorConfig-FEFEFE?logo=editorconfig&logoColor=black) 
![Canvas](https://img.shields.io/badge/-Canvas-FFC0CB?logo=canvas&logoColor=white) 


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

## ✨ Guidelines and Future Development

* **Not Covered Edge Cases:** Overwriting previously generated icons without a prompt in batch mode is not necessary. It unnecessarily consumes resources even though the description would not change.
* **For splitting words in English:** I recommend using [https://www.hyphenation24.com/](https://www.hyphenation24.com/). This tool is handy for manually breaking words, which can be very useful.
