# Electron-VoiceInterfacePrototype

## Installation
Download a compressed copy of the project, or evn better run the following command and open up the folder if you have [Git](https://git-scm.com) installed.
```
git clone https://github.com/RedKenrok/Electron-VoiceInterfacePrototype.git && cd Electron-VoiceInterfacePrototype
```

Make sure [Node.js](htpps://nodejs.org) is installed, this installation will also include [npm.js](htpps://npmjs.org). Run the following command install the project dependencies.
```
npm install
```

### Keys
Add a file named 'keys.json' to the 'app/data/' directory and add the following information.
```
{
  "wit": "SERVER_ACCESS_TOKEN"
}
```

> Replace the phrase 'SERVER_ACCESS_TOKEN' with the server access token retrieved from [wit.ai](https://www.wit.ai)


### Hotword detection
If you want to use [snowboy](https://snowboy.kitt.ai)'s hotword detection and are running MacOS or a compatible Linux distro then add a file named 'configuration.json' to the 'app/data/snowboy/' directory and add the following information.

```
{
  "detector": {
    "resource": "./node_modules/snowboy/resources/common.res"
  },
  "models": [
    {
      "file": "./node_modules/snowboy/resources/snowboy.umdl",
      "hotwords": "snowboy"
    }
  ],
  "recorder": {}
}
```

> Replace the given data with your own and add any other to configure it.
