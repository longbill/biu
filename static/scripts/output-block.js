class OutputBlock {
  constructor(id, line) {
    let that = this;

    let wrapper = document.createElement('div');
    wrapper.className = 'output-block-wrapper';

    wrapper.innerHTML = `\
<div class="output-block">
  <div class="operations">
    <button class="start" data-type="start">start</button>
    <button class="restart" data-type="restart">restart</button>
    <button class="stop" data-type="stop">stop</button>
    <button class="close red" data-type="close">close</button>
  </div>
  <div class="command"></div>
  <pre class="output"></pre>
</div>`;

    wrapper
      .getElementsByClassName('command')[0]
      .innerText = line;

    this.block = wrapper.getElementsByClassName('output-block')[0];
    this.pre = wrapper.getElementsByClassName('output')[0];
    this.wrapper = wrapper;

    let opWrapper = wrapper.getElementsByClassName('operations')[0];

    opWrapper.addEventListener('click', event => {
      let button = event.target;

      if (button.tagName !== 'BUTTON') {
        return;
      }

      let type = button.getAttribute('data-type');

      socket.emit(type, { id });
    });
  }

  setState(state) {
    let block = this.block;
    block.classList.remove('running');
    block.classList.remove('stopped');

    if (state) {
      block.classList.add(state);
    }
  }

  append(html) {
    let pre = this.pre;
    let atBottom = pre.scrollHeight === pre.scrollTop + pre.clientHeight;

    let temp = document.createElement('div');
    temp.innerHTML = html;

    let fragment = document.createDocumentFragment();

    while (temp.childNodes.length) {
      fragment.appendChild(temp.childNodes[0]);
    }

    pre.appendChild(fragment);

    if (atBottom) {
      pre.scrollTop = pre.scrollHeight - pre.clientHeight;
    }
  }

  remove() {
    let parentNode = this.wrapper.parentNode;
    parentNode.removeChild(this.wrapper);
  }
}
