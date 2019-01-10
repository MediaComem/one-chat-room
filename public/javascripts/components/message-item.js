Vue.component('message-item', {
  template: '#message-item-template',
  props: [ 'message', 'now' ],
  computed: {
    humanCreatedAt,
    jdenticon
  }
});

function humanCreatedAt() {
  return moment(this.message.createdAt).from(moment.max(moment(this.now), moment(this.message.createdAt)));
}

function jdenticon() {
  return jdenticon.toSvg(this.message.author, 80);
}
