'use static'

class Tooltip {

    constructor(el) {
        this.element = el
        this.tipText = el.dataset.tooltip
        this.elementStyle = {
            top: 0,
            left: 0
        }
        this.events()
    }

    // 默认只支持以键值对的方式设置样式
    css(el, attr) {
        if(typeof attr === 'object') {
            // 传入的第二个参数是对象，则默认为设置样式
            for(let o in attr) {
                el.style[o] = attr[o]
            }
        }else {
            return window.getComputedStyle(el)[attr]
        }
    }

    // 多个className以单个空格分割
    removeClass(el, className) {
        const _classList = className.split(' ')
        for(let name of _classList) {
            el.classList.remove(name)
        }
    }

    offset(el) {
        let _offset = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }

        let _scroll = {
            left: document.body.scrollLeft || document.documentElement.scrollLeft,
            top: document.body.scrollTop || document.documentElement.scrollTop
        }

        while (el) {
            _offset.left += el.offsetLeft
            _offset.top += el.offsetTop
            el = el.offsetParent
        }

        _offset.top -= _scroll.top
        _offset.left -= _scroll.left
        _offset.right = document.body.clientWidth - _offset.left
        _offset.bottom = window.innerHeight - _offset.top
        return _offset
    }

    createDom() {
        this.tooltipEl = document.createElement('div')
        this.tooltipEl.className = 'lx-tooltip'
        this.tooltipEl.innerText = this.tipText
        document.body.appendChild(this.tooltipEl)
    }

    show() {
        const _el = this.tooltipEl
        const _offset = this.offset(this.element)
        let _className = '' // 提示框方向className
        let _style = {} // 提示框的样式
        console.log(_offset)
        this.css(_el, { display: 'block', top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' })
        this.removeClass(_el, 'top right bottom left')

        if (_offset.left < 80) {
            _className = 'right'
            _style = {
                top: `${_offset.top + parseInt(this.css(this.element, 'height')) / 2}px`,
                left: `${_offset.left + 8}px`
            }
        } else if (_offset.right < 80) {
            _className = 'left'
            _style = {
                top: `${_offset.top + parseInt(this.css(this.element, 'height')) / 2}px`,
                right: `${_offset.right + 8}px`
            }
        } else if (_offset.top < 80) {
            _className = 'bottom'
            _style = {
                top: `${_offset.top + 8 + parseInt(this.css(this.element, 'height'))}px`,
                left: `${_offset.left + 8}px`
            }
        }else {
            _className = 'top'
            _style = {
                bottom: `${_offset.bottom + 8}px`,
                left: `${_offset.left + 8}px`
            }
        }
        _el.classList.add(_className)
        this.css(_el, _style)
    }

    hide() {
        this.css(this.tooltipEl, { display: 'none' })
    }

    events() {
        this.element.addEventListener('mouseover', event => {
            if(this.tooltipEl) {
                this.show()
            }else {
                this.createDom()
                this.show()
            }
        }, false)
        this.element.addEventListener('mouseout', event => {
            if (this.tooltipEl) {
                this.hide()
            }
        }, false)
    }

}

const tooltipEles = document.querySelectorAll('[data-tooltip]')

for (const item of tooltipEles) {
    const tooltip = new Tooltip(item)
}