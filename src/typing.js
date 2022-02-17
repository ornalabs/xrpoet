const hri = require('human-readable-ids').hri;

VARTISTE.Util.registerComponentSystem('typing', {
  init() {
    this.name = hri.random()
    this.words = []
    this.inputField = document.createElement('input')
    this.inputField.classList.add('keyboard-form')
    this.inputField.editField = this
    document.body.append(this.inputField)

    document.querySelector('*[wasd-controls]').setAttribute('wasd-controls', 'enabled', false)
    document.querySelector('*[desktop-controls]').components['desktop-controls'].tick = function() {}

    this.inputField.addEventListener('keyup', (e) => {
      this.typewriter.emit('typeup')
      this.typewriter.object3D.position.set(0, 0, 0)
      if (event.key === "Enter")
      {
        this.space()
        this.words.push("\n")
        this.save()
      }

      if (event.key === " ")
      {
        this.space()
      }
    })

    this.inputField.addEventListener('keydown', (e) => {
      this.typewriter.emit('typedown')
    });

    document.body.onfocus = (e) => this.inputField.focus();


    window.addEventListener("keydown", (event) => {
      this.el.sceneEl.systems['artist-root'].acceptOrientationPrompt()
      this.hideInstructions()

      // if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true
      if (event.key !== "s" || !event.ctrlKey) return true
      this.space()
      this.save()
      event.preventDefault()
      return false
    })

    this.inputField.addEventListener('input', (e) => {
      this.setValue(this.inputField.value)
      // this.numpad.querySelector('.value').setAttribute('text', {value: this.inputField.value})
    })

    this.textDisplay = document.querySelector('#text-display')

    this.el.sceneEl.addEventListener('enter-vr', (e) => {
      this.inputField.focus()
    })

    document.body.onfocus = (e) => {
      console.log("Force Focus")
      this.inputField.focus()
    }
    this.inputField.focus()

    document.body.addEventListener('mouseup', () => this.inputField.focus())

    this.lastWord = document.querySelector('#last-word')
    this.typewriter = document.querySelector('#typewriter')
    this.saveDisk = document.querySelector('#save-disk')

    VARTISTE.Util.whenLoaded(this.lastWord, () => {
      this.lastWord.components['troika-text'].troikaTextMesh.addEventListener('synccomplete', () => {
        this.kaching = true
      })
    })

    let preset = new URLSearchParams(location.search).get('preset');
    if (!preset) preset = 'autumn';
    document.getElementById('enviropack').setAttribute('enviropack', 'preset: ' + preset)
  },
  setValue(value) {
    this.textDisplay.setAttribute('troika-text', 'value', value)
  },
  save() {
    let url = "data:text/plain;base64," + btoa(this.words.join(""))

    let desktopLink = document.createElement('a')
    desktopLink.href = url
    desktopLink.style = "z-index: 10000; position: absolute; top: 50%; left: 50%; padding: 5px; background-color: #eee; transform: translate(-50%,-50%)"
    desktopLink.innerHTML = "Save"
    desktopLink.download = `${this.name}-${new Date().toJSON().split(":")[0]}.txt`
    // document.body.append(desktopLink)

    desktopLink.click()

    this.saveDisk.emit('save')
  },
  space() {
    this.lastWord.setAttribute('troika-text', 'value', this.inputField.value)
    this.lastWord.setAttribute('text-opacity', 0)
    this.words.push(this.inputField.value)
    this.inputField.value = ""
    this.setValue("")
  },
  hideInstructions() {
    document.querySelector('.about').remove()
    document.querySelector('.presets').remove()
    this.hideInstructions = function() {}
  },
  tick(t, dt) {
    if (this.kaching)
    {
      this.lastWord.emit('kaching')
      this.kaching = false
    }
  }
})

AFRAME.registerComponent('text-opacity', {
  schema: { default: 1.0 },
  events: {
    object3dset: function(e) {
      this.el.object3D.traverse(o => {
        if (o.material) { o.material.transparent = true; o.material.needsUpdate = true; }
      })
    }
  },
  update() {
    this.el.object3D.traverse(o => {
      if (o.material) { o.material.opacity = this.data; }
    })
  }
})
