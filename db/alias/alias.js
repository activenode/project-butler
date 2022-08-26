module.exports.Alias = class {
   _value;
   constructor(value) {
      this.value = value;
   }
   get value() {
      return this._value;
   }
   set value(value) {
      this._value = value.toString();
   }
};
