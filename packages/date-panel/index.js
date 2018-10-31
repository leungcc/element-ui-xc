import ELDatePanel from '../date-picker/src/panel/xcDatePanel';

/* istanbul ignore next */
ELDatePanel.install = function(Vue) {
  Vue.component(ELDatePanel.name, ELDatePanel);
};

export default ELDatePanel;
