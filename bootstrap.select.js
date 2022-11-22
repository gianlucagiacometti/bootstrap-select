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
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 */

"use strict"

// constant which contains all class elements generated automatically with the aniumation selectInserted
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

		this.element.classList.add("d-none")
		this.label.classList.add("d-none")

		this.visibility = "collapsed"
		if (parameters['visibility'] && ["expanded"].includes(parameters['visibility'])) {
			this.visibility = parameters['visibility']
		}

		let value = this.element.value
		let text = [...this.element.selectedOptions].map(item => item.text).join()

		let selectWrapper = document.createElement("div")
		selectWrapper.id = "select-wrapper-" + this.seq
		selectWrapper.classList.add("select-wrapper", "dropdown")
		selectWrapper.innerHTML = '<div id="select-input-wrapper-' + this.seq + '" class="select-input-wrapper"><label class="form-label" for="select-input-' + this.seq + '">' + this.label.innerHTML + '</label><input id="select-input-' + this.seq + '" type="text" class="form-control select-input" value="' + text + '" readonly></div>'
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
		}

		if (this.element.tabIndex) {
			input.tabIndex = parseInt(this.element.tabIndex)
		}

		if (this.element.hasAttribute("placeholder")) {
			input.setAttribute('placeholder', this.element.getAttribute("placeholder"))
		}

		input.addEventListener('keydown', (event) => {
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
		list.setAttribute('aria-role', "listbox")
		list.innerHTML = this.#wrapOptions(this.element.children)

		options.appendChild(list)

		if (this.element.classList.contains("searchable")) {
			let searchText = this.element.dataset.bsSelectSearchText ? this.element.dataset.bsSelectSearchText : "Search..."
			let search = document.createElement("div")
			search.id = "select-search-wrapper-" + this.seq
			search.classList.add("form-control", "select-search-wrapper")
			search.innerHTML = '<input id="select-search-input-' + this.seq + '" class="select-search-input" value="" placeholder="' + searchText + '"><i id="select-search-icon-' + this.seq + '" class="bi bi-x-lg select-search-icon"></i>'
			dropdown.appendChild(search)
		}

		dropdown.appendChild(options)
		wrapper.appendChild(dropdown)
		document.querySelector("#select-input-wrapper-" + this.seq).appendChild(wrapper)

		let self = this

		document.querySelector("#select-input-" + this.seq).addEventListener('click', function(event) {
			let wrappers = document.querySelectorAll(".select-dropdown-wrapper:not(#select-dropdown-wrapper-" + self.seq + ")")
			for (let i = 0; i < wrappers.length; ++i) {
				wrappers[i].classList.remove("show")
			}
			bootstrap.Dropdown.getOrCreateInstance("#select-input-wrapper-" + self.seq).toggle()
		})

		if (this.element.classList.contains("searchable")) {
			document.querySelector("#select-search-input-" + this.seq).addEventListener('input', function(event) {
				let value = String(event.target.value).toLowerCase()
				if (value.length > 0) {
					for (let rnd of Object.keys(self.options)) {
						if (!self.optionGroups.includes(rnd) && self.options[rnd].text.toLowerCase().includes(value)) {
							document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.remove("d-none")
						}
						else if (!self.optionGroups.includes(rnd)) {
							document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.add("d-none")
						}
					}
				}
				else {
					for (let rnd of Object.keys(self.options)) {
						if (!self.optionGroups.includes(rnd)) {
							document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.remove("d-none")
						}
					}
				}
			})
			document.querySelector("#select-search-icon-" + this.seq).addEventListener('click', function(event) {
				document.querySelector("#select-search-input-" + self.seq).value = ""
				for (let rnd of Object.keys(self.options)) {
					if (!self.optionGroups.includes(rnd)) {
						document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.remove("d-none")
					}
				}
			})
			document.querySelector("#select-wrapper-" + this.seq).addEventListener('hidden.bs.dropdown', function() {
				document.querySelector("#select-search-input-" + self.seq).value = ""
				for (let rnd of Object.keys(self.options)) {
					if (!self.optionGroups.includes(rnd)) {
						document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.remove("d-none")
					}
				}
			})
		}

		for (let rnd of Object.keys(this.options)) {
			if (!this.options[rnd].disabled && !this.optionGroups.includes(rnd)) {
				document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).addEventListener('click', function(e) {
					if (self.multiple) {
						document.querySelector("#select-option-checkbox-" + self.seq + "-" + rnd).checked = !document.querySelector("#select-option-checkbox-" + self.seq + "-" + rnd).checked
						self.options[rnd].selected = document.querySelector("#select-option-checkbox-" + self.seq + "-" + rnd).checked
						if (self.options[rnd].selected) {
							document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.add("selected")
							if ((self.optionParents[rnd] != "0") && Object.keys(self.options).includes(self.optionParents[rnd])) { 
								let selected = true
								for (let child of self.options[self.optionParents[rnd]].children) {
									if (!child.selected) {
										selected = false
										break
									}
								}
								if (selected) {
									self.options[self.optionParents[rnd]].selected = true
									document.querySelector("#select-option-group-checkbox-" + self.seq + "-" + self.optionParents[rnd]).checked = true
									document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + self.optionParents[rnd]).classList.add("selected")
								}
							}
						}
						else {
							document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.remove("selected")
							if (Object.keys(self.options).includes(self.optionParents[rnd])) { 
								self.options[self.optionParents[rnd]].selected = false
								document.querySelector("#select-option-group-checkbox-" + self.seq + "-" + self.optionParents[rnd]).checked = false
								document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + self.optionParents[rnd]).classList.remove("selected")
							}
						}
						document.querySelector("#select-input-" + self.seq).value = [...self.element.selectedOptions].map(item => item.text).join()
					}
					else {
						document.querySelector("#select-input-" + self.seq).value = document.querySelectorAll("#select-option-wrapper-" + self.seq + "-" + rnd + " .select-option-text")[0].innerHTML
						document.querySelector("#select-dropdown-wrapper-" + self.seq).classList.remove("show")
						for (let i of Object.keys(self.options)) {
							self.options[i].selected = false
						}
						self.options[rnd].selected = true
						document.querySelector("#" + self.id).value = self.options[rnd].value
					}
					e.preventDefault()
				})
			}
			else if (self.multiple && this.optionGroups.includes(rnd)) {
				document.querySelector("#select-option-group-wrapper-" + this.seq + "-" + rnd + " > div.form-check").addEventListener('click', function(e) {
					document.querySelector("#select-option-group-checkbox-" + self.seq + "-" + rnd).checked = !document.querySelector("#select-option-group-checkbox-" + self.seq + "-" + rnd).checked
					self.#setDescendantsAlike(self.options[rnd])
					document.querySelector("#select-input-" + self.seq).value = [...self.element.selectedOptions].map(item => item.text).join()
					e.preventDefault()
				})
			}
		}

	} // constructor

	#setDescendantsAlike(element) {
		let checked = document.querySelector("#select-option-group-checkbox-" + this.seq + "-" + element.dataset.rnd).checked
		let children = element.querySelectorAll("option", "optgroup")
		for (let child of children) {
			let rnd = child.dataset.rnd
			if (child.tagName == "OPTGROUP") {
				document.querySelector("#select-option-group-checkbox-" + this.seq + "-" + rnd).checked = checked
				if (checked) {
					document.querySelector("#select-option-group-wrapper-" + this.seq + "-" + rnd).classList.add("selected")
				}
				else {
					document.querySelector("#select-optiongroup--wrapper-" + this.seq + "-" + rnd).classList.remove("selected")
				}
				this.#setDescendantsAlike(child)
			}
			else {
				child.selected = checked
				document.querySelector("#select-option-checkbox-" + this.seq + "-" + rnd).checked = checked
				if (checked) {
					document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).classList.add("selected")
				}
				else {
					document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).classList.remove("selected")
				}
			}
		}
	}

	#wrapOptions(children, parent = 0) {
		let list = ""
		let pile = 0
		this.optionPiles[parent] = {}
		this.optionPiles[parent][pile] = []
		for (let child of children) {
			let rnd = "" + Date.now() + Math.floor(Math.random()*1000)
			let item = ""
			let itemDisabled = child.disabled ? ' disabled' : ''
			let itemSelected = child.selected ? ' selected' : ''
			let itemChecked = child.selected && !child.disabled ? ' checked' : ''
			let iconClass = child.dataset.bsSelectOptionIconClass ? ' ' + child.dataset.bsSelectOptionIconClass : ''
			let icon = child.dataset.bsSelectOptionIcon ? '<i class="bi bi-' + child.dataset.bsSelectOptionIcon + ' me-2' + iconClass + '"></i>' : ''
			let imageClass = child.dataset.bsSelectOptionImageClass ? ' ' + child.dataset.bsSelectOptionImageClass : ''
			let image = child.dataset.bsSelectOptionImage ? '<span class="select-option-image-wrapper"><img class="select-option-image' + imageClass + '" src="' +  child.dataset.bsSelectOptionImage + '" alt=""></span>' : ''
			let comment = child.dataset.bsSelectOptionComment ? '<div class="select-option-comment">' + child.dataset.bsSelectOptionComment + '</div>' : ''
			if (child.tagName === "OPTION") {
				this.optionPiles[parent][pile].push(rnd)
				if (this.multiple) {
					item = '<div id="select-option-wrapper-' + this.seq + '-' + rnd + '" class="select-option-wrapper' + itemDisabled + itemSelected + '"><div class="form-check"><input type="checkbox" id="select-option-checkbox-' + this.seq + '-' + rnd + '" class="form-check-input select-option-checkbox" value="' + rnd + '"' + itemDisabled + itemChecked + '><label class="form-check-label select-option-label" for="select-option-checkbox-' + this.seq + '-' + rnd + '"><div id="select-option-' + this.seq + '-' + rnd + '" class="select-option select-option-' + this.seq + itemDisabled + itemSelected + '" role="option"><span class="select-option-text-wrapper">' + icon + '<span class="select-option-text">' + child.text + '</span></span>' + image + '</div></label>' + comment + '</div></div>'
				}
				else {
					item = '<div id="select-option-wrapper-' + this.seq + '-' + rnd + '" class="select-option-wrapper' + itemDisabled + itemSelected + '"><div id="select-option-' + this.seq + '-' + rnd + '" class="select-option select-option-' + this.seq + '" role="option"><span class="select-option-text-wrapper">' + icon + '<span class="select-option-text">' + child.text + '</span></span>' + image + '</div>' + comment + '</div>'
				}
			}
			else if (child.tagName === "OPTGROUP") {
				this.optionGroups.push(rnd)
				pile += 1
				this.optionPiles[parent][pile] = []
				this.optionPiles[parent][pile].push(rnd)
				pile += 1
				this.optionPiles[parent][pile] = []
				if (this.multiple) {
					item = '<div id="select-option-group-wrapper-' + this.seq + '-' + rnd + '" class="select-option-group-wrapper"><div class="form-check"><input type="checkbox" id="select-option-group-checkbox-' + this.seq + '-' + rnd + '" class="form-check-input select-option-group-checkbox" value="' + rnd + '"><label class="form-check-label select-option-group-label" for="select-option-group-checkbox-' + this.seq + '-' + rnd + '"><div id="select-option-group-' + this.seq + '-' + rnd + '" class="select-option-group select-option-group-' + this.seq + '" role="optgroup"><span class="select-option-group-text-wrapper">' + icon + '<span class="select-option-group-text">' + child.label + '</span></span>' + image + '</div></label>' + comment + '</div><div id="select-option-group-children-' + this.seq + '-' + rnd + '" class="select-option-group-children">' + this.#wrapOptions(child.children, rnd) + '</div></div>'
				}
				else {
					item = '<div id="select-option-group-wrapper-' + this.seq + '-' + rnd + '" class="select-option-group-wrapper"><div id="select-option-group-' + this.seq + '-' + rnd + '" class="select-option-group select-option-group-' + this.seq + '" role="optgroup"><span class="select-option-group-text-wrapper">' + icon + '<span class="select-option-group-text">' + child.label + '</span></span>' + image + '</div>' + comment + '<div id="select-option-group-children-' + this.seq + '-' + rnd + '" class="select-option-group-children">' + this.#wrapOptions(child.children, rnd) + '</div></div>'
				}
			}
			child.dataset.rnd = rnd
			this.options[rnd] = child
			this.optionParents[rnd] = parent
			list += item
		}
		return list
	} // #wrapOptions

	#sortedChanged(obj1, obj2) {
		if (!obj1 || Object.getPrototypeOf(obj1) !== Object.prototype || !obj2 || Object.getPrototypeOf(obj2) !== Object.prototype) {
			throw new TypeError("Attributes of #sortedChanged are not acceptable objects", "bootstrap.select.js", 331)
		}
		if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
			return false
		}
		else if (!Object.keys(this.sorted).length) {
			return true
		}
		else if (((!obj1['mode'] || (obj1['mode'] == "asc")) && obj2['mode'] && (obj2['mode'] == "desc")) || ((!obj2['mode'] || (obj2['mode'] == "asc")) && obj1['mode'] && (obj1['mode'] == "desc"))) {
			return true
		}
		else if (obj1['disabled'] && obj2['disabled'] && obj1['disabled'] != obj2['disabled']) {
			return true
		}
		else if (((!obj1['disabled'] || (obj1['disabled'] == "ignore")) && obj2['disabled'] && ["top", "bottom", "include"].includes(obj2['disabled'])) || ((!obj2['disabled'] || (obj2['disabled'] == "ignore")) && obj1['disabled'] && ["top", "bottom", "include"].includes(obj1['disabled']))) {
			return true
		}
		else if (((!obj1['sortDisabled'] || (obj1['sortDisabled'] == "true")) && obj2['sortDisabled'] && (obj2['sortDisabled'] == "false")) || ((!obj2['sortDisabled'] || (obj2['sortDisabled'] == "true")) && obj1['sortDisabled'] && (obj1['sortDisabled'] == "false"))) {
			return true
		}
		else if (((!obj1['emptyDisabledValues'] || (obj1['emptyDisabledValues'] == "top")) && obj2['emptyDisabledValues'] && (obj2['emptyDisabledValues'] == "include")) || ((!obj2['emptyDisabledValues'] || (obj2['emptyDisabledValues'] == "top")) && obj1['emptyDisabledValues'] && (obj1['emptyDisabledValues'] == "include"))) {
			return true
		}
		else if (((!obj1['optionGroups'] || (obj1['optionGroups'] == "include")) && obj2['optionGroups'] && (obj2['optionGroups'] == "ignore")) || ((!obj2['optionGroups'] || (obj2['optionGroups'] == "include")) && obj1['optionGroups'] && (obj1['optionGroups'] == "ignore"))) {
			return true
		}
		else {
			return false
		}
	} // #sortedChanged

	#compareSelectChildren(opt1, opt2) {
		if ((opt1.tagName === "OPTION") && (opt2.tagName === "OPTION")) {
			return opt1.text.localeCompare(opt2.text)
		}
		else if ((opt1.tagName === "OPTION") && (opt2.tagName === "OPTGROUP")) {
			return opt1.text.localeCompare(opt2.label)
		}
		else if ((opt1.tagName === "OPTGROUP") && (opt2.tagName === "OPTION")) {
			return opt1.label.localeCompare(opt2.text)
		}
		else if ((opt1.tagName === "OPTGROUP") && (opt2.tagName === "OPTGROUP")) {
			return opt1.label.localeCompare(opt2.label)
		}
		else {
			throw new TypeError("Attributes of #compareSelectChildren are not acceptable objects", "bootstrap.select.js", 364)
		}
	} // #compareSelectChildren

	#sortWrapper(parameters, parent = 0) {

		let sorted = []
		let unsorted = [[]]
		let self = this
		let active = []
		let inactive = []
		let inactiveIndexes = []
		let inactiveEmpty = []
		let activeGroups = []
		let inactiveGroups = []
		let inactiveGroupIndexes = []
		let list = parent == 0 ? document.querySelector("#select-option-list-" + this.seq) : document.querySelector("#select-option-group-children-" + this.seq + "-" + parent)

		let shift
		if (parameters['mode'] == "asc") {
			shift = 1
		}
		else {
			shift = -1
		}

		for (let pile of Object.keys(this.optionPiles[parent])) {
			if (parameters['optionGroups'] == "include") {
				unsorted[0] = unsorted[0].concat((this.optionPiles[parent][pile]))
			}
			else {
				unsorted[pile] = this.optionPiles[parent][pile]
			}
		}

		for (let [pile, arr] of unsorted.entries()) {

			for (let [index, rnd] of unsorted[pile].entries()) {
				if (self.optionParents[rnd] == parent) {
					if (self.options[rnd].disabled) {
						inactive.push(rnd)
						inactiveIndexes.push(index)
						if ((!self.optionGroups.includes(rnd)) && (self.options[rnd].value == "")) {
							inactiveEmpty.push(rnd)
						}
					}
					else {
						active.push(rnd)
					}
				}
			}

			if (parameters['disabled'] != "include") {

				let activeSorted = []
				let inactiveSorted = []

				active.sort((a, b) => shift * this.#compareSelectChildren(self.options[a], self.options[b])).forEach(function(rnd, index) {
					activeSorted.push(rnd)
				})

				if ((parameters['sortDisabled'] == "true") && (parameters['disabled'] != "ignore")) {
					inactive.sort((a, b) => shift * this.#compareSelectChildren(self.options[a], self.options[b])).forEach(function(rnd, index) {
						inactiveSorted.push(rnd)
					})
				}
				else {
					inactiveSorted = inactive
				}

				if (parameters['disabled'] == "top") {
					for (let rnd of inactiveSorted) {
						sorted.push(rnd)
						if (parent == 0) {
							self.element.appendChild(self.options[rnd])
						}
						else {
							self.options[parent].appendChild(self.options[rnd])
						}
						if (self.optionGroups.includes(rnd)) {
							list.appendChild(document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + rnd))
							sorted = sorted.concat(self.#sortWrapper(parameters, rnd))
						}
						else {
							list.appendChild(document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd))
						}
					}
					for (let rnd of activeSorted) {
						sorted.push(rnd)
						if (parent == 0) {
							self.element.appendChild(self.options[rnd])
						}
						else {
							self.options[parent].appendChild(self.options[rnd])
						}
						if (self.optionGroups.includes(rnd)) {
							list.appendChild(document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + rnd))
							sorted = sorted.concat(self.#sortWrapper(parameters, rnd))
						}
						else {
							list.appendChild(document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd))
						}
					}
				}
				else if (parameters['disabled'] == "bottom") {
					for (let rnd of activeSorted) {
						sorted.push(rnd)
						if (parent == 0) {
							self.element.appendChild(self.options[rnd])
						}
						else {
							self.options[parent].appendChild(self.options[rnd])
						}
						if (self.optionGroups.includes(rnd)) {
							list.appendChild(document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + rnd))
							sorted = sorted.concat(self.#sortWrapper(parameters, rnd))
						}
						else {
							list.appendChild(document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd))
						}
					}
					for (let rnd of inactiveSorted) {
						sorted.push(rnd)
						if (parent == 0) {
							self.element.appendChild(self.options[rnd])
						}
						else {
							self.options[parent].appendChild(self.options[rnd])
						}
						if (self.optionGroups.includes(rnd)) {
							list.appendChild(document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + rnd))
							sorted = sorted.concat(self.#sortWrapper(parameters, rnd))
						}
						else {
							list.appendChild(document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd))
						}
					}
				}
				else {
					for (let i = 0; i < unsorted[pile].length; i++) {
						if (inactiveIndexes.includes(i)) {
							sorted.push(inactiveSorted[0])
							if (parent == 0) {
								this.element.appendChild(this.options[inactiveSorted[0]])
							}
							else {
								this.options[parent].appendChild(this.options[inactiveSorted[0]])
							}
							if (this.optionGroups.includes(inactiveSorted[0])) {
								list.appendChild(document.querySelector("#select-option-group-wrapper-" + this.seq + "-" + inactiveSorted[0]))
								sorted = sorted.concat(self.#sortWrapper(parameters, inactiveSorted[0]))
							}
							else {
								list.appendChild(document.querySelector("#select-option-wrapper-" + this.seq + "-" + inactiveSorted[0]))
							}
							inactiveSorted.shift()
						}
						else {
							sorted.push(activeSorted[0])
							if (parent == 0) {
								this.element.appendChild(this.options[activeSorted[0]])
							}
							else {
								this.options[parent].appendChild(this.options[activeSorted[0]])
							}
							if (this.optionGroups.includes(activeSorted[0])) {
								list.appendChild(document.querySelector("#select-option-group-wrapper-" + this.seq + "-" + activeSorted[0]))
								sorted = sorted.concat(self.#sortWrapper(parameters, activeSorted[0]))
							}
							else {
								list.appendChild(document.querySelector("#select-option-wrapper-" + this.seq + "-" + activeSorted[0]))
							}
							activeSorted.shift()
						}
					}
				}

			}
			else {
				unsorted[pile].keys().sort((a, b) => shift * this.#compareSelectChildren(self.options[a], self.options[b])).forEach(function(rnd) {
					sorted.push(rnd)
					if (parent == 0) {
						self.element.appendChild(self.options[rnd])
					}
					else {
						self.options[parent].appendChild(self.options[rnd])
					}
					if (self.optionGroups.includes(rnd)) {
						list.appendChild(document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + rnd))
						sorted = sorted.concat(self.#sortWrapper(parameters, rnd))
					}
					else {
						list.appendChild(document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd))
					}
				})
			}

			if (parameters['emptyDisabledValues'] == "top") {
				for (let rnd of inactiveEmpty) {
					if (parent == 0) {
						this.element.firstChild.before(this.options[rnd])
					}
					else {
						this.options[parent].firstChild.before(this.options[rnd])
					}
					list.insertBefore(document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd), list.firstChild)
				}
			}

		}

		return sorted

	} // #sortWrapper

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

		if (!parameters['optionGroups'] ||  !["include", "ignore"].includes(parameters['optionGroups'])) {
			parameters['optionGroups'] = "include"
		}

		// do nothing if already sorted
//		if (this.#sortedChanged(parameters, this.sorted)) {

			let sorted = this.#sortWrapper(parameters)

			// re-arrange the array of options
			let newOptions = {}
			for (let rnd of sorted) {
				newOptions[rnd] = this.options[rnd]
			}
			this.options = newOptions

			// update the sorting parameters
			this.sorted = parameters

//		}

	} // sort

	remove(obj) {

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
						if (this.options[rnd].value == value) {
							document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).remove()
							this.options[rnd].remove()
							delete this.options[rnd]
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
							document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).remove()
							this.options[rnd].remove()
							delete this.options[rnd]
						}
					}
				}
			}
			if ("index" in obj) {
				for (let rnd of Object.keys(this.options)) {
					if (rnd == obj['index']) {
						document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).remove()
						this.options[rnd].remove()
						delete this.options[rnd]
					}
				}
			}
		}
		else {
			console.warn("Warning: Argument of bsSelect.remove() must be a valid hash like { value: 'value', values: ['value1', 'value2'], id: 'id', ids: ['id1', 'id2'], index: 'valid select-option index' }")
		}

	} // remove

	insert(options, parents) {

		if (typeof options === "string") {
			let template = document.createElement("template")
			template.innerHTML = options
			options = template.content.childNodes
		}
		else if (!Array.isArray(options)) {
			options = [options]
		}

		// valid parents are: object id, object index (0 or a random 16-digit integer)
		if (parents && !Array.isArray(parents) && ((typeof parents === "string") || ((parents.toString().length == 16) && Number.isInteger(parents)))) {
			parents = [parents]
		}
		else if (parents && Array.isArray(parents)) {
			for (let [i, parent] of parents.entries()) {
				if ((typeof parent !== "string") && ((parent.toString().length != 16) || !Number.isInteger(parent))) {
					parents[i] = 0
				}
			}
		}
		else {
			parents = [0]
		}

		for (let [index, option] of options.entries()) {

			if (!!(option && option.nodeType === Node.ELEMENT_NODE && ["OPTION", "OPTGROUP"].includes(option.tagName))) {

				let list
				let parent

				if (parents[index]) {
					if ((typeof parents[index] === "string") && document.querySelector("#" + parents[index])) {
						for (let [rnd, obj] of this.options) {
							if (obj.isEqualNode(document.querySelector("#" + parents[index])) && (option.tagName === "OPTGROUP")) {
								parent = rnd
								list = document.querySelector("#select-option-group-children-" + this.seq + "-" + rnd)
								break
							}
						}
					}
					else if ((typeof parents[index] === "number") && Object.keys(this.options).includes(parents[index]) && this.optionGroups.includes(parents['index'])) {
						parent = parents[index]
						list = document.querySelector("#select-option-group-children-" + this.seq + "-" + parents[index])
					}
					else {
						parent = 0
						list = document.querySelector("#select-option-list-" + this.seq)
					}
				}
				else {
					parent = 0
					list = document.querySelector("#select-option-list-" + this.seq)
				}

				let rnd = "" + Date.now() + Math.floor(Math.random()*1000)
				let item = ""
				let itemDisabled = option.disabled ? ' disabled' : ''
				let itemSelected = option.selected ? ' selected' : ''
				let itemChecked = option.selected && !option.disabled ? ' checked' : ''
				let iconClass = option.dataset.bsSelectOptionIconClass ? ' ' + option.dataset.bsSelectOptionIconClass : ''
				let icon = option.dataset.bsSelectOptionIcon ? '<i class="bi bi-' + option.dataset.bsSelectOptionIcon + ' me-2' + iconClass + '"></i>' : ''
				let imageClass = option.dataset.bsSelectOptionImageClass ? ' ' + option.dataset.bsSelectOptionImageClass : ''
				let image = option.dataset.bsSelectOptionImage ? '<span class="select-option-image-wrapper"><img class="select-option-image' + imageClass + '" src="' +  option.dataset.bsSelectOptionImage + '"></span>' : ''
				let comment = option.dataset.bsSelectOptionComment ? '<div class="select-option-comment">' + option.dataset.bsSelectOptionComment + '</div>' : ''

				if (option.tagName === "OPTION") {
					if (this.multiple) {
						item = '<div id="select-option-wrapper-' + this.seq + '-' + rnd + '" class="select-option-wrapper' + itemDisabled + itemSelected + '"><div class="form-check"><input type="checkbox" id="select-option-checkbox-' + this.seq + '-' + rnd + '" class="form-check-input select-option-checkbox" value="' + rnd + '"' + itemDisabled + itemChecked + '><label class="form-check-label select-option-label" for="select-option-checkbox-' + this.seq + '-' + rnd + '"><div id="select-option-' + this.seq + '-' + rnd + '" class="select-option select-option-' + this.seq + itemDisabled + itemSelected + '" role="option"><span class="select-option-text-wrapper">' + icon + '<span class="select-option-text">' + option.text + '</span></span>' + image + '</div></label>' + comment + '</div></div>'
					}
					else {
						item = '<div id="select-option-wrapper-' + this.seq + '-' + rnd + '" class="select-option-wrapper' + itemDisabled + itemSelected + '"><div id="select-option-' + this.seq + '-' + rnd + '" class="select-option select-option-' + this.seq + '" role="option"><span class="select-option-text-wrapper">' + icon + '<span class="select-option-text">' + option.text + '</span></span>' + image + '</div>' + comment + '</div>'
					}
				}
				else if (option.tagName === "OPTGROUP") {
					if (this.multiple) {
						item = '<div id="select-option-group-wrapper-' + this.seq + '-' + rnd + '" class="select-option-group-wrapper"><div class="form-check"><input type="checkbox" id="select-option-group-checkbox-' + this.seq + '-' + rnd + '" class="form-check-input select-option-group-checkbox" value="' + rnd + '"><label class="form-check-label select-option-group-label" for="select-option-group-checkbox-' + this.seq + '-' + rnd + '"><div id="select-option-group-' + this.seq + '-' + rnd + '" class="select-option-group select-option-group-' + this.seq + '" role="optgroup"><span class="select-option-group-text-wrapper">' + icon + '<span class="select-option-group-text">' + option.label + '</span></span>' + image + '</div></label>' + comment + '</div><div id="select-option-group-children-' + this.seq + '-' + rnd + '" class="select-option-group-children"></div></div>'
					}
					else {
						item = '<div id="select-option-group-wrapper-' + this.seq + '-' + rnd + '" class="select-option-group-wrapper"><div id="select-option-group-' + this.seq + '-' + rnd + '" class="select-option-group select-option-group-' + this.seq + '" role="optgroup"><span class="select-option-group-text-wrapper">' + icon + '<span class="select-option-group-text">' + option.label + '</span></span>' + image + '</div>' + comment + '<div id="select-option-group-children-' + this.seq + '-' + rnd + '" class="select-option-group-children"></div></div>'
					}
				}

				let template = document.createElement("template")
				template.innerHTML = item
				list.appendChild(template.content.firstChild)

				option.dataset.rnd = rnd

				if (parent == 0) {
					this.element.appendChild(option)
				}
				else {
					for (let rnd of this.optionParents) {
						if (rnd == parent) {
							document.querySelector('optgroup[data-rnd="' + rnd + '"]').appendChild(option)
							break
						}
					}
				}

				this.options[rnd] = option
				this.optionParents[rnd] = parent
				this.optionPiles[parent][0].push(rnd)

				if (!option.disabled) {
					let self = this
					document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).addEventListener('click', function(e) {
						if (self.multiple) {
							document.querySelector("#select-option-checkbox-" + self.seq + "-" + rnd).checked = !document.querySelector("#select-option-checkbox-" + self.seq + "-" + rnd).checked
							self.options[rnd].selected = document.querySelector("#select-option-checkbox-" + self.seq + "-" + rnd).checked
							document.querySelector("#" + self.id + " option[value='" + self.options[rnd].value + "']").selected = self.options[rnd].selected
							if (self.options[rnd].selected) {
								document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.add("selected")
								if ((self.optionParents[rnd] != "0") && Object.keys(self.options).includes(self.optionParents[rnd])) { 
									let selected = true
									for (let child of self.options[self.optionParents[rnd]].children) {
										if (!child.selected) {
											selected = false
											break
										}
									}
									if (selected) {
										self.options[self.optionParents[rnd]].selected = true
										document.querySelector("#select-option-group-checkbox-" + self.seq + "-" + self.optionParents[rnd]).checked = true
										document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + self.optionParents[rnd]).classList.add("selected")
									}
								}
							}
							else {
								document.querySelector("#select-option-wrapper-" + self.seq + "-" + rnd).classList.remove("selected")
								if (Object.keys(self.options).includes(self.optionParents[rnd])) { 
									self.options[self.optionParents[rnd]].selected = false
									document.querySelector("#select-option-group-checkbox-" + self.seq + "-" + self.optionParents[rnd]).checked = false
									document.querySelector("#select-option-group-wrapper-" + self.seq + "-" + self.optionParents[rnd]).classList.remove("selected")
								}
							}
							document.querySelector("#select-input-" + self.seq).value = [...self.element.selectedOptions].map(item => item.text).join()
						}
						else {
							document.querySelector("#select-input-" + self.seq).value = document.querySelectorAll("#select-option-wrapper-" + self.seq + "-" + rnd + " .select-option-text")[0].innerHTML
							document.querySelector("#select-dropdown-wrapper-" + self.seq).classList.remove("show")
							for (let i of Object.keys(self.options)) {
								self.options[i].selected = false
							}
							self.options[rnd].selected = true
							document.querySelector("#" + self.id).value = self.options[rnd].value
						}
						e.preventDefault()
					})
				}

			}
			else {
				console.warn("Warning: Attribute of bsSelect.insert() must be of type 'OPTION' or 'OPTGROUP' (" + option.tagName + " given)")
			}

		}

		this.sort(this.sorted)

	} // insert

	value(values, options = { swap: true, disabled: false }) {
		if (values === undefined) {
			if (this.element.multiple) {
				return [...this.element.selectedOptions].map(item => item.text)
			}
			else {
				return this.element.value
			}
		}
		else {
			if (this.element.multiple) {
				if (!Array.isArray(values)) {
					values = [values]
				}
				values = values.map(num => { return String(num) })
				if (options['swap']) {
					for (let rnd of Object.keys(this.options)) {
						this.options[rnd].selected = false
						document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).classList.remove("selected")
						document.querySelector("#select-option-checkbox-" + this.seq + "-" + rnd).checked = false
					}
				}
				for (let rnd of Object.keys(this.options)) {
					if ((options['disabled'] || (!options['disabled'] && !this.options[rnd].disabled)) && (values.indexOf(this.options[rnd].value) >= 0)) {
						this.options[rnd].selected = true
						document.querySelector("#select-option-wrapper-" + this.seq + "-" + rnd).classList.add("selected")
						if (!options['disabled']) {
							document.querySelector("#select-option-checkbox-" + this.seq + "-" + rnd).checked = true
						}
					}
					else if (this.options[rnd].disabled && (values.indexOf(this.options[rnd].value) >= 0)) {
						console.warn("Warning: Trying to select the disabled option vith value " + this.options[rnd].value + "; use `.value(value, { disabled: true })` to select disabled options")
					}
				}
				document.querySelector("#select-input-" + this.seq).value = [...this.element.selectedOptions].map(item => item.text).join()
			}
			else {
				if (Array.isArray(values)) {
					values = String(values[0])
				}
				else {
					values = String(values)
				}
				let index = 0
				let disabled = false
				for (let rnd of Object.keys(this.options)) {
					if (this.options[rnd].value == values)  {
						index = rnd
						if (this.options[rnd].disabled) {
							disabled = true
						}
					}
				}
				if ((index > 0) && (options['disabled'] || (!options['disabled'] && !disabled))) {
					this.element.value = values
					document.querySelector("#select-input-" + this.seq).value = this.options[index].text
				}
				else {
					console.warn("Warning: Trying to select a disabled option; use `.value(value, { disabled: true })` to select disabled options")
				}
			}
		}
	}

	disabled(status) {
		if (!status || (typeof status != "boolean")) {
			status = false
		}
		this.element.disabled = status
		document.querySelector("#select-input-" + this.seq).disabled = status
	}

	readonly(status) {
		if (!status || (typeof status != "boolean")) {
			status = false
		}
		this.element.disabled = status
		let input = document.querySelector("#select-input-" + this.seq)
		var newInput = input.cloneNode()
		input.parentNode.replaceChild(newInput, input);
		if (!status) {
			let self = this
			document.querySelector("#select-input-" + this.seq).addEventListener('click', function(event) {
				let wrappers = document.querySelectorAll(".select-dropdown-wrapper:not(#select-dropdown-wrapper-" + self.seq + ")")
				for (let i = 0; i < wrappers.length; ++i) {
					wrappers[i].classList.remove("show")
				}
				bootstrap.Dropdown.getOrCreateInstance("#select-input-wrapper-" + self.seq).toggle()
			})
		}
	}

	destroy() {
		document.querySelector("#select-wrapper-" + this.seq).after(this.element)
		this.element.after(this.label)
		document.querySelector("#select-wrapper-" + this.seq).remove()
		this.element.classList.remove("bootstrap-select", "d-none")
		this.label.classList.remove("d-none")
	} // destroy

}

// all select dropdowns will be closed with the Escape key
document.querySelector("html").addEventListener('keydown', (event) => {
	let wrappers = document.querySelectorAll('.select-dropdown-wrapper')
	if (event.code === 'Escape' && wrappers.length) {
		for (let i = 0; i < wrappers.length; ++i) {
			wrappers[i].classList.remove("show")
		}
	}
})

// a new element of the class will be created as soon as a SELECT element with class bootstrap-select is injected or as soon as the class is added to an existing SELECT
// a new element of the class may be created manually if the SELECT has no bootstrap-select class
let insertListener = (e) => {

	if (e.animationName == "selectInserted") {

		let id = e.target.id
		let seq = "" + Date.now() + Math.floor(Math.random()*1000)

		FORM.select[id] = new bsSelect(id, seq)

	}

} // insertListener

document.addEventListener("animationstart", insertListener)
document.addEventListener("MSAnimationStart", insertListener)
document.addEventListener("webkitAnimationStart", insertListener)

 /* END OF FILE */