/**
 * 
 * Bootstrap Select
 *
 * Extension class for the Bootstrap select element
 *
 * @author Gianluca Giacometti
 *
 * Copyright (C) Gianluca Giacometti (https://github.com/gianlucagiacometti)
 *
 * This program provides a class which extends the Bootstrap select element.
 * This program requires Bootstrap (https://getbootstrap.com)
 * For more information see README.md.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 *
 */

"use strict"

// constant which contains all class elements generated automatically with the animation selectInserted
const FORM = { select: {} }

class bsSelect {

	constructor(id, seq, parameters = {}) {

		this.id = id
		this.element = document.querySelector("#" + this.id)
		if (!this.element) {
			throw new TypeError("Element does not exist { id: '" + this.id + "' }", "bootstrap.select.js", 35)
		}
		else if (this.element.nodeType !== Node.ELEMENT_NODE || this.element.tagName !== "SELECT") {
			throw new TypeError("Element must be of type 'SELECT' ('" + this.element.tagName + "' given)", "bootstrap.select.js", 35)
		}

		this.label = document.querySelector('label[for="' + this.id + '"]')
		if (!this.label) {
			throw new TypeError("Element must have a label", "bootstrap.select.js", 43)
		}

		this.seq = seq
		this.items = this.element.dataset.bsSelectItems && parseInt(this.element.dataset.bsSelectItems) > 0 ? parseInt(this.element.dataset.bsSelectItems) : 5
		this.multiple = this.element.multiple
		this.options = {}
		this.optionGroups = []
		this.optionParents = {}
		this.optionPiles = {}
		this.sorted = {}
		this.visibility = "collapsed"
		if (parameters['visibility'] && ["expanded"].includes(parameters['visibility'])) {
			this.visibility = parameters['visibility']
		}

		this.element.classList.add("d-none")
		this.label.classList.add("d-none")

		let text = [...this.element.selectedOptions].map(item => item.text).join()
		let selectWrapper = document.createElement("div")
		selectWrapper.id = "select-wrapper-" + this.seq
		selectWrapper.classList.add("select-wrapper", "dropdown")

		let toggleCheckbox = this.element.multiple && this.element.dataset.bsSelectToggleButton ? '<div id="select-toggle-wrapper-' + this.seq + '" class="form-check select-toggle-checkbox"><input type="checkbox" id="select-toggle-checkbox-' + this.seq + '" class="form-check-input"></div>' : ''
		selectWrapper.innerHTML = '<div id="select-input-wrapper-' + this.seq + '" class="select-input-wrapper"><label class="form-label" for="select-input-' + this.seq + '">' + this.label.innerHTML + '</label><input id="select-input-' + this.seq + '" type="text" class="form-control select-input" value="' + this.#escapeAttribute(text) + '" readonly>' + toggleCheckbox + '</div>'

		let children = [...this.element.parentNode.children]
		this.element.parentNode.appendChild(selectWrapper)
		for (let child of children) {
			selectWrapper.appendChild(child)
		}

		let input = document.querySelector("#select-input-" + this.seq)
		if (this.element.classList.contains("label-floating")) {
			input.parentNode.classList.add("form-floating")
			input.after(document.querySelector('label[for="select-input-' + this.seq + '"]'))
		}
		else if (this.element.classList.contains("label-outline")) {
			input.parentNode.classList.add("form-outline")
			input.after(document.querySelector('label[for="select-input-' + this.seq + '"]'))
		}
		if (this.element.classList.contains("form-select-lg")) {
			input.classList.add("form-control-lg")
		}
		if (this.element.classList.contains("form-select-sm")) {
			input.classList.add("form-control-sm")
		}
		if (this.element.classList.contains("form-select-plaintext")) {
			input.classList.add("form-control-plaintext")
		}
		if (this.element.disabled) {
			input.disabled = true
			input.setAttribute("aria-disabled", "true")
		}
		if (this.element.tabIndex) {
			input.tabIndex = parseInt(this.element.tabIndex)
		}
		if (this.element.hasAttribute("placeholder")) {
			input.setAttribute('placeholder', this.element.getAttribute("placeholder"))
		}
		else {
			input.setAttribute('placeholder', "placeholder")
		}
		input.addEventListener('keydown', event => {
			if (event.code === 'Tab' || event.code === 'Escape') {
				return
			}
			event.preventDefault()
		})

		let wrapper = document.createElement("div")
		wrapper.classList.add("select-dropdown-wrapper", "dropdown-menu")
		wrapper.id = "select-dropdown-wrapper-" + this.seq
		wrapper.style.width = input.style.width
		if (this.visibility == "expanded") {
			wrapper.classList.add("show")
		}

		let dropdown = document.createElement("div")
		dropdown.id = "select-dropdown-" + this.seq
		dropdown.classList.add("select-dropdown")
		dropdown.setAttribute('tabindex', "0")

		let options = document.createElement("div")
		options.id = "select-option-list-wrapper-" + this.seq
		options.classList.add("select-option-list-wrapper")

		let list = document.createElement("div")
		list.id = "select-option-list-" + this.seq
		list.classList.add("select-option-list")
		list.setAttribute('role', "listbox")
		options.appendChild(list)

		if (this.element.classList.contains("searchable")) {
			let searchText = this.element.dataset.bsSelectSearchText ? this.element.dataset.bsSelectSearchText : "Search..."
			let search = document.createElement("div")
			search.id = "select-search-wrapper-" + this.seq
			search.classList.add("form-control", "select-search-wrapper")
			search.innerHTML = '<input id="select-search-input-' + this.seq + '" class="form-control select-search-input" value="" placeholder="' + this.#escapeAttribute(searchText) + '"><i id="select-search-icon-' + this.seq + '" class="bi bi-x-lg select-search-icon"></i>'
			dropdown.appendChild(search)
		}

		dropdown.appendChild(options)
		wrapper.appendChild(dropdown)
		document.querySelector("#select-input-wrapper-" + this.seq).appendChild(wrapper)

		this.#wrapChildren(this.element.children, list, 0)

		let self = this
		input.addEventListener('click', function(event) {
			if (self.element.disabled || self.element.dataset.bsSelectReadonly == "true") {
				event.preventDefault()
				return
			}
			let wrappers = document.querySelectorAll(".select-dropdown-wrapper:not(#select-dropdown-wrapper-" + self.seq + ")")
			for (let i = 0; i < wrappers.length; ++i) {
				wrappers[i].classList.remove("show")
			}
			bootstrap.Dropdown.getOrCreateInstance("#select-input-wrapper-" + self.seq).toggle()
			let inputField = document.querySelector('#select-search-input-' + self.seq)
			if (inputField) {
				inputField.focus()
			}
		})

		if (this.element.multiple && this.element.dataset.bsSelectToggleButton) {
			document.querySelector("#select-toggle-checkbox-" + this.seq).addEventListener('click', function(event) {
				for (let rnd of Object.keys(self.options)) {
					if (!self.optionGroups.includes(rnd) && !self.options[rnd].disabled) {
						self.options[rnd].selected = event.target.checked
					}
				}
				self.#syncAll()
				self.#dispatchChange()
			})
		}

		list.addEventListener('click', function(event) {
			let groupCheck = event.target.closest(".form-check")
			if (groupCheck && groupCheck.parentNode && groupCheck.parentNode.classList.contains("select-option-group-wrapper")) {
				let groupWrapper = groupCheck.parentNode
				let rnd = groupWrapper.id.replace("select-option-group-wrapper-" + self.seq + "-", "")
				if (self.multiple && self.optionGroups.includes(rnd)) {
					let checkbox = document.querySelector("#select-option-group-checkbox-" + self.seq + "-" + rnd)
					checkbox.checked = !checkbox.checked
					self.#setDescendantsAlike(self.options[rnd])
					self.#syncAll()
					self.#dispatchChange()
					event.preventDefault()
				}
				return
			}

			let optionWrapper = event.target.closest(".select-option-wrapper")
			if (!optionWrapper || !list.contains(optionWrapper)) {
				return
			}

			let rnd = optionWrapper.id.replace("select-option-wrapper-" + self.seq + "-", "")
			if (!Object.keys(self.options).includes(rnd) || self.options[rnd].disabled) {
				return
			}

			if (self.multiple) {
				self.options[rnd].selected = !self.options[rnd].selected
			}
			else {
				for (let i of Object.keys(self.options)) {
					if (!self.optionGroups.includes(i)) {
						self.options[i].selected = false
					}
				}
				self.options[rnd].selected = true
				document.querySelector("#select-dropdown-wrapper-" + self.seq).classList.remove("show")
			}

			self.#syncAll()
			self.#dispatchChange()
			event.preventDefault()
		})

		if (this.element.classList.contains("searchable")) {
			document.querySelector("#select-search-input-" + this.seq).addEventListener('input', function(event) {
				self.#filterOptions(String(event.target.value).toLowerCase())
			})
			document.querySelector("#select-search-icon-" + this.seq).addEventListener('click', function() {
				document.querySelector("#select-search-input-" + self.seq).value = ""
				self.#filterOptions("")
			})
			document.querySelector("#select-wrapper-" + this.seq).addEventListener('hidden.bs.dropdown', function() {
				document.querySelector("#select-search-input-" + self.seq).value = ""
				self.#filterOptions("")
			})
		}

		this.#syncAll(false)

	} // constructor

	#escapeAttribute(value) {
		return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
	}

	#cleanComment(comment) {
		let wrapper = document.createElement("div")
		wrapper.innerHTML = comment
		for (let node of wrapper.childNodes) {
			if ((node.tagName === "SELECT") || (node.tagName === "OPTION")) {
				node.remove()
			}
		}
		return wrapper.innerHTML
	}

	#dispatchChange() {
		this.element.dispatchEvent(new Event("change", { bubbles: true }))
	}

	#syncAll() {
		this.#syncOptionGroups()
		this.#syncOptionStates()
		this.#syncToggleCheckbox()
		this.#syncInputText()
	}

	#syncInputText() {
		document.querySelector("#select-input-" + this.seq).value = [...this.element.selectedOptions].map(item => item.text).join()
	}

	#syncOptionStates() {
		for (let rnd of Object.keys(this.options)) {
			if (this.optionGroups.includes(rnd)) {
				continue
			}
			let wrapper = document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd)
			let checkbox = document.querySelector("#select-option-checkbox-" + this.seq + "-" + rnd)
			if (wrapper) {
				if (this.options[rnd].selected) {
					wrapper.classList.add("selected")
				}
				else {
					wrapper.classList.remove("selected")
				}
			}
			if (checkbox) {
				checkbox.checked = this.options[rnd].selected
			}
		}
	}

	#syncToggleCheckbox() {
		if (!this.element.multiple || !this.element.dataset.bsSelectToggleButton) {
			return
		}
		let toggle = document.querySelector("#select-toggle-checkbox-" + this.seq)
		if (!toggle) {
			return
		}
		let selectableOptions = Object.keys(this.options).filter(rnd => {
			return !this.optionGroups.includes(rnd) && !this.options[rnd].disabled
		})
		toggle.checked = selectableOptions.length > 0 && selectableOptions.every(rnd => {
			return this.options[rnd].selected
		})
	}

	#syncOptionGroups() {
		if (!this.element.multiple) {
			return
		}
		for (let rnd of this.optionGroups) {
			if (!this.options[rnd]) {
				continue
			}
			let selected = true
			let selectable = false
			for (let child of this.options[rnd].querySelectorAll("option")) {
				if (child.disabled) {
					continue
				}
				selectable = true
				if (!child.selected) {
					selected = false
					break
				}
			}
			let checkbox = document.querySelector("#select-option-group-checkbox-" + this.seq + "-" + rnd)
			let wrapper = document.querySelector("#select-option-group-wrapper-" + this.seq + "-" + rnd)
			this.options[rnd].selected = selectable && selected
			if (checkbox) {
				checkbox.checked = selectable && selected
			}
			if (wrapper) {
				if (selectable && selected) {
					wrapper.classList.add("selected")
				}
				else {
					wrapper.classList.remove("selected")
				}
			}
		}
	}

	#setDescendantsAlike(element) {
		let checked = document.querySelector("#select-option-group-checkbox-" + this.seq + "-" + element.dataset.rnd).checked
		let children = element.querySelectorAll("option, optgroup")
		for (let child of children) {
			let rnd = child.dataset.rnd
			if (child.tagName == "OPTGROUP") {
				let checkbox = document.querySelector("#select-option-group-checkbox-" + this.seq + "-" + rnd)
				if (checkbox) {
					checkbox.checked = checked
				}
			}
			else if (!child.disabled) {
				child.selected = checked
			}
		}
	}

	#filterOptions(value) {
		for (let rnd of Object.keys(this.options)) {
			if (!this.optionGroups.includes(rnd)) {
				let wrapper = document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd)
				if (wrapper) {
					if (!value || this.options[rnd].text.toLowerCase().includes(value)) {
						wrapper.classList.remove("d-none")
					}
					else {
						wrapper.classList.add("d-none")
					}
				}
			}
		}
	}

	#newRnd() {
		let rnd = "" + Date.now() + Math.floor(Math.random() * 1000)
		while (Object.keys(this.options).includes(rnd)) {
			rnd = "" + Date.now() + Math.floor(Math.random() * 1000)
		}
		return rnd
	}

	#wrapChildren(children, list, parent = 0) {
		if (!this.optionPiles[parent]) {
			this.optionPiles[parent] = { 0: [] }
		}
		for (let child of [...children]) {
			this.#addOptionElement(child, list, parent)
		}
	}

	#addOptionElement(option, list, parent = 0) {
		if (!option || option.nodeType !== Node.ELEMENT_NODE || !["OPTION", "OPTGROUP"].includes(option.tagName)) {
			return null
		}

		let rnd = option.dataset.rnd || this.#newRnd()
		option.dataset.rnd = rnd
		this.options[rnd] = option
		this.optionParents[rnd] = parent
		if (!this.optionPiles[parent]) {
			this.optionPiles[parent] = { 0: [] }
		}
		if (!this.optionPiles[parent][0].includes(rnd)) {
			this.optionPiles[parent][0].push(rnd)
		}

		let template = document.createElement("template")
		template.innerHTML = this.#optionHtml(option, rnd)
		let node = template.content.firstChild
		list.appendChild(node)

		if (option.tagName === "OPTGROUP") {
			if (!this.optionGroups.includes(rnd)) {
				this.optionGroups.push(rnd)
			}
			this.optionPiles[rnd] = { 0: [] }
			let childList = document.querySelector("#select-option-group-children-" + this.seq + "-" + rnd)
			this.#wrapChildren(option.children, childList, rnd)
		}

		return rnd
	}

	#optionHtml(option, rnd) {
		let itemDisabled = option.disabled ? ' disabled' : ''
		let itemSelected = option.selected ? ' selected' : ''
		let itemChecked = option.selected && !option.disabled ? ' checked' : ''
		let iconClass = option.dataset.bsSelectOptionIconClass ? ' ' + option.dataset.bsSelectOptionIconClass : ''
		let icon = option.dataset.bsSelectOptionIcon ? '<i class="bi bi-' + option.dataset.bsSelectOptionIcon + ' me-2' + iconClass + '"></i>' : ''
		let imageClass = option.dataset.bsSelectOptionImageClass ? ' ' + option.dataset.bsSelectOptionImageClass : ''
		let image = option.dataset.bsSelectOptionImage ? '<span class="select-option-image-wrapper"><img class="select-option-image' + imageClass + '" src="' + option.dataset.bsSelectOptionImage + '" alt=""></span>' : ''
		let comment = option.dataset.bsSelectOptionComment ? '<div class="select-option-comment">' + this.#cleanComment(option.dataset.bsSelectOptionComment) + '</div>' : ''

		if (option.tagName === "OPTION") {
			if (option.dataset.bsSelectOptionDivider) {
				return '<hr>'
			}
			if (this.multiple) {
				return '<div id="select-option-wrapper-' + this.seq + '-' + rnd + '" class="select-option-wrapper' + itemDisabled + itemSelected + '"><div class="form-check"><input type="checkbox" id="select-option-checkbox-' + this.seq + '-' + rnd + '" class="form-check-input select-option-checkbox" value="' + rnd + '"' + itemDisabled + itemChecked + '><label class="form-check-label select-option-label" for="select-option-checkbox-' + this.seq + '-' + rnd + '"><div id="select-option-' + this.seq + '-' + rnd + '" class="select-option select-option-' + this.seq + itemDisabled + itemSelected + '" role="option"><span class="select-option-text-wrapper">' + icon + '<span class="select-option-text">' + option.text + '</span></span>' + image + '</div></label>' + comment + '</div></div>'
			}
			return '<div id="select-option-wrapper-' + this.seq + '-' + rnd + '" class="select-option-wrapper' + itemDisabled + itemSelected + '"><div id="select-option-' + this.seq + '-' + rnd + '" class="select-option select-option-' + this.seq + itemDisabled + itemSelected + '" role="option"><span class="select-option-text-wrapper">' + icon + '<span class="select-option-text">' + option.text + '</span></span>' + image + '</div>' + comment + '</div>'
		}

		if (this.multiple) {
			return '<div id="select-option-group-wrapper-' + this.seq + '-' + rnd + '" class="select-option-group-wrapper"><div class="form-check"><input type="checkbox" id="select-option-group-checkbox-' + this.seq + '-' + rnd + '" class="form-check-input select-option-group-checkbox" value="' + rnd + '"><label class="form-check-label select-option-group-label" for="select-option-group-checkbox-' + this.seq + '-' + rnd + '"><div id="select-option-group-' + this.seq + '-' + rnd + '" class="select-option-group select-option-group-' + this.seq + '" role="optgroup"><span class="select-option-group-text-wrapper">' + icon + '<span class="select-option-group-text">' + option.label + '</span></span>' + image + '</div></label>' + comment + '</div><div id="select-option-group-children-' + this.seq + '-' + rnd + '" class="select-option-group-children"></div></div>'
		}
		return '<div id="select-option-group-wrapper-' + this.seq + '-' + rnd + '" class="select-option-group-wrapper"><div id="select-option-group-' + this.seq + '-' + rnd + '" class="select-option-group select-option-group-' + this.seq + '" role="optgroup"><span class="select-option-group-text-wrapper">' + icon + '<span class="select-option-group-text">' + option.label + '</span></span>' + image + '</div>' + comment + '<div id="select-option-group-children-' + this.seq + '-' + rnd + '" class="select-option-group-children"></div></div>'
	}

	#compareSelectChildren(a, b) {
		let aText = a.tagName === "OPTGROUP" ? a.label : a.text
		let bText = b.tagName === "OPTGROUP" ? b.label : b.text
		return String(aText).localeCompare(String(bText), undefined, { numeric: true, sensitivity: "base" })
	}

	#sortContainer(parent = 0, parameters = {}) {
		let nativeParent = parent == 0 ? this.element : this.options[parent]
		let list = parent == 0 ? document.querySelector("#select-option-list-" + this.seq) : document.querySelector("#select-option-group-children-" + this.seq + "-" + parent)
		if (!nativeParent || !list) {
			return []
		}

		let shift = parameters['mode'] == "desc" ? -1 : 1
		let children = [...nativeParent.children].filter(child => ["OPTION", "OPTGROUP"].includes(child.tagName))
		let groups = children.filter(child => child.tagName === "OPTGROUP")
		let options = children.filter(child => child.tagName === "OPTION")
		if (parameters['optionGroups'] == "include") {
			children = children.slice().sort((a, b) => shift * this.#compareSelectChildren(a, b))
		}
		else {
			children = groups.concat(options.slice().sort((a, b) => shift * this.#compareSelectChildren(a, b)))
		}

		let disabled = children.filter(child => child.disabled)
		let active = children.filter(child => !child.disabled)
		if (parameters['disabled'] == "top") {
			children = disabled.concat(active)
		}
		else if (parameters['disabled'] == "bottom") {
			children = active.concat(disabled)
		}
		else if (parameters['disabled'] == "ignore") {
			children = active.concat(disabled)
		}

		let sorted = []
		for (let child of children) {
			let rnd = child.dataset.rnd
			if (!rnd || !this.options[rnd]) {
				continue
			}
			nativeParent.appendChild(child)
			let visible = this.optionGroups.includes(rnd) ? document.querySelector("#select-option-group-wrapper-" + this.seq + "-" + rnd) : document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd)
			if (visible) {
				list.appendChild(visible)
			}
			sorted.push(rnd)
			if (this.optionGroups.includes(rnd)) {
				sorted = sorted.concat(this.#sortContainer(rnd, parameters))
			}
		}

		this.optionPiles[parent] = { 0: sorted.filter(rnd => this.optionParents[rnd] == parent) }
		return sorted
	}

	sort(parameters = {}) {
		if (typeof parameters === "string") {
			parameters = { mode: parameters }
		}
		if (!parameters['mode'] || parameters['mode'] != "desc") {
			parameters['mode'] = "asc"
		}
		if (!parameters['disabled'] || !["ignore", "top", "bottom", "include"].includes(parameters['disabled'])) {
			parameters['disabled'] = "ignore"
		}
		if (!parameters['sortDisabled'] || !["true", "false"].includes(parameters['sortDisabled'])) {
			parameters['sortDisabled'] = "true"
		}
		if (!parameters['emptyDisabledValues'] || !["top", "include"].includes(parameters['emptyDisabledValues'])) {
			parameters['emptyDisabledValues'] = "top"
		}
		if (!parameters['optionGroups'] || !["include", "ignore"].includes(parameters['optionGroups'])) {
			parameters['optionGroups'] = "include"
		}

		let sorted = this.#sortContainer(0, parameters)
		let newOptions = {}
		for (let rnd of sorted) {
			if (this.options[rnd]) {
				newOptions[rnd] = this.options[rnd]
			}
		}
		this.options = newOptions
		this.sorted = parameters
	} // sort

	#removeFromOptionPiles(rnd) {
		for (let parent of Object.keys(this.optionPiles)) {
			for (let pile of Object.keys(this.optionPiles[parent])) {
				this.optionPiles[parent][pile] = this.optionPiles[parent][pile].filter(item => item != rnd)
			}
		}
		delete this.optionPiles[rnd]
	}

	#removeOptionElement(rnd) {
		if (!this.options[rnd]) {
			return
		}
		if (this.optionGroups.includes(rnd)) {
			for (let child of this.options[rnd].querySelectorAll("option, optgroup")) {
				if (child.dataset.rnd && Object.keys(this.options).includes(child.dataset.rnd)) {
					this.#removeFromOptionPiles(child.dataset.rnd)
					delete this.options[child.dataset.rnd]
					delete this.optionParents[child.dataset.rnd]
					this.optionGroups = this.optionGroups.filter(item => item != child.dataset.rnd)
				}
			}
			let wrapper = document.querySelector("#select-option-group-wrapper-" + this.seq + "-" + rnd)
			if (wrapper) {
				wrapper.remove()
			}
			this.optionGroups = this.optionGroups.filter(item => item != rnd)
		}
		else {
			let wrapper = document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd)
			if (wrapper) {
				wrapper.remove()
			}
		}
		this.#removeFromOptionPiles(rnd)
		this.options[rnd].remove()
		delete this.options[rnd]
		delete this.optionParents[rnd]
	}

	remove(obj) {
		let removed = false
		if (!!(obj && Object.getPrototypeOf(obj) === Object.prototype)) {
			if ("value" in obj) {
				if ("values" in obj && Array.isArray(obj['values'])) {
					obj['values'].push(obj['value'])
				}
				else {
					obj['values'] = [obj['value']]
				}
			}
			if ("values" in obj && Array.isArray(obj['values']) && obj['values'].length) {
				for (let value of obj['values']) {
					for (let rnd of Object.keys(this.options)) {
						if (!this.optionGroups.includes(rnd) && this.options[rnd].value == value) {
							this.#removeOptionElement(rnd)
							removed = true
						}
					}
				}
			}
			if ("id" in obj) {
				if ("ids" in obj && Array.isArray(obj['ids'])) {
					obj['ids'].push(obj['id'])
				}
				else {
					obj['ids'] = [obj['id']]
				}
			}
			if ("ids" in obj && Array.isArray(obj['ids']) && obj['ids'].length) {
				for (let id of obj['ids']) {
					for (let rnd of Object.keys(this.options)) {
						if (this.options[rnd].id == id) {
							this.#removeOptionElement(rnd)
							removed = true
						}
					}
				}
			}
			if ("index" in obj) {
				for (let rnd of Object.keys(this.options)) {
					if (rnd == obj['index']) {
						this.#removeOptionElement(rnd)
						removed = true
					}
				}
			}
		}
		else {
			console.warn("Warning: Argument of bsSelect.remove() must be a valid hash like { value: 'value', values: ['value1', 'value2'], id: 'id', ids: ['id1', 'id2'], index: 'valid select-option index' }")
		}

		if (removed) {
			this.#syncAll()
			this.#dispatchChange()
		}
	} // remove

	insert(options, parents) {
		if (typeof options === "string") {
			let template = document.createElement("template")
			template.innerHTML = options
			options = [...template.content.childNodes].filter(node => node.nodeType === Node.ELEMENT_NODE)
		}
		else if (!Array.isArray(options) && !(options instanceof NodeList)) {
			options = [options]
		}
		else {
			options = [...options]
		}

		if (parents && !Array.isArray(parents) && ((typeof parents === "string") || ((parents.toString().length == 16) && Number.isInteger(parents)))) {
			parents = [parents]
		}
		else if (!parents) {
			parents = [0]
		}

		let changed = false
		for (let [index, option] of options.entries()) {
			if (!(option && option.nodeType === Node.ELEMENT_NODE && ["OPTION", "OPTGROUP"].includes(option.tagName))) {
				console.warn("Warning: Attribute of bsSelect.insert() must be of type 'OPTION' or 'OPTGROUP' (" + option.tagName + " given)")
				continue
			}

			let parent = 0
			let list = document.querySelector("#select-option-list-" + this.seq)
			if (parents[index]) {
				let parentElement = null
				if (typeof parents[index] === "string") {
					parentElement = this.element.querySelector('optgroup[id="' + parents[index] + '"]')
					if (!parentElement && Object.keys(this.options).includes(parents[index]) && this.optionGroups.includes(parents[index])) {
						parentElement = this.options[parents[index]]
					}
				}
				else if ((typeof parents[index] === "number") && Object.keys(this.options).includes(String(parents[index])) && this.optionGroups.includes(String(parents[index]))) {
					parentElement = this.options[String(parents[index])]
				}
				if (parentElement && parentElement.dataset.rnd) {
					parent = parentElement.dataset.rnd
					list = document.querySelector("#select-option-group-children-" + this.seq + "-" + parent)
				}
			}

			if (parent == 0) {
				this.element.appendChild(option)
			}
			else {
				this.options[parent].appendChild(option)
			}

			this.#addOptionElement(option, list, parent)
			if (!this.multiple && option.selected) {
				for (let rnd of Object.keys(this.options)) {
					if (!this.optionGroups.includes(rnd) && this.options[rnd] !== option) {
						this.options[rnd].selected = false
					}
				}
			}
			if (option.selected || option.querySelector("option:checked")) {
				changed = true
			}
		}

		this.sort(this.sorted)
		this.#syncAll()
		if (changed) {
			this.#dispatchChange()
		}
	} // insert

	value(values, options = { swap: true, disabled: false }) {
		if (values === undefined) {
			if (this.element.multiple) {
				return [...this.element.selectedOptions].map(item => item.value)
			}
			return this.element.value
		}

		if (this.element.multiple) {
			if (!Array.isArray(values)) {
				values = [values]
			}
			values = values.map(num => { return String(num) })
			if (options['swap']) {
				for (let rnd of Object.keys(this.options)) {
					if (!this.optionGroups.includes(rnd)) {
						this.options[rnd].selected = false
					}
				}
			}
			for (let rnd of Object.keys(this.options)) {
				if (this.optionGroups.includes(rnd)) {
					continue
				}
				if ((options['disabled'] || (!options['disabled'] && !this.options[rnd].disabled)) && values.indexOf(this.options[rnd].value) >= 0) {
					this.options[rnd].selected = true
				}
				else if (this.options[rnd].disabled && values.indexOf(this.options[rnd].value) >= 0) {
					console.warn("Warning: Trying to select the disabled option with value " + this.options[rnd].value + "; use `.value(value, { disabled: true })` to select disabled options")
				}
			}
		}
		else {
			if (Array.isArray(values)) {
				values = String(values[0])
			}
			else {
				values = String(values)
			}
			let found = false
			let disabled = false
			for (let rnd of Object.keys(this.options)) {
				if (!this.optionGroups.includes(rnd) && this.options[rnd].value == values) {
					found = true
					disabled = this.options[rnd].disabled
				}
			}
			if (found && (options['disabled'] || (!options['disabled'] && !disabled))) {
				this.element.value = values
			}
			else {
				console.warn("Warning: Trying to select a disabled option; use `.value(value, { disabled: true })` to select disabled options")
			}
		}

		this.#syncAll()
		this.#dispatchChange()
	} // value

	disabled(status) {
		if (!status || (typeof status != "boolean")) {
			status = false
		}
		this.element.disabled = status
		let input = document.querySelector("#select-input-" + this.seq)
		let dropdown = document.querySelector("#select-dropdown-wrapper-" + this.seq)
		input.disabled = status
		input.setAttribute("aria-disabled", status ? "true" : "false")
		if (status) {
			dropdown.classList.remove("show")
		}
	} // disabled

	readonly(status) {
		if (!status || (typeof status != "boolean")) {
			status = false
		}
		let input = document.querySelector("#select-input-" + this.seq)
		if (status) {
			this.element.dataset.bsSelectReadonly = "true"
			input.classList.add("readonly")
			input.setAttribute("aria-readonly", "true")
		}
		else {
			delete this.element.dataset.bsSelectReadonly
			input.classList.remove("readonly")
			input.removeAttribute("aria-readonly")
		}
	} // readonly

	destroy() {
		let wrapper = document.querySelector("#select-wrapper-" + this.seq)
		if (!wrapper) {
			return
		}
		let parent = wrapper.parentNode
		let children = [...wrapper.children]
		for (let child of children) {
			parent.insertBefore(child, wrapper)
		}
		wrapper.remove()
		this.element.classList.remove("d-none")
		this.label.classList.remove("d-none")
		delete FORM.select[this.id]
	} // destroy

} // class bsSelect

let elements = document.querySelectorAll('select.select')
let seq = Date.now() + Math.floor(Math.random() * 1000)
for (let element of elements) {
	FORM.select[element.id] = new bsSelect(element.id, seq)
	seq++
}

/* END OF FILE */
