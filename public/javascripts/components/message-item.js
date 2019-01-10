Vue.component('message-item', {
  template: '#message-item-template',
  props: [ 'message', 'now' ],
  computed: {
    humanCreatedAt,
    identicon
  }
});

function humanCreatedAt() {
  return moment(this.message.createdAt).from(moment.max(moment(this.now), moment(this.message.createdAt)));
}

function identicon() {
  return typeof jdenticon !== undefined ? jdenticon.toSvg(this.message.author, 80): '';
}
