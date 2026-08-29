/**
 * @typedef options
 * @property {boolean} isAlphanumeric - Indique si le champ doit être alphanumérique.
 * @property {number} min - La longueur minimale du champ.
 * @property {number} max - La longueur maximale du champ.
 */

class Validator {
  #errors;
  /**
   * Initialise un nouveau validateur.
   * @param {string} field - Le champ à valider.
   * @param {string} type - Le type de validation.
   * @param {options} options - Les options de validation.
   */
  constructor(field, type, options) {
    this.field = field;
    this.options = options;
    this.type = type;
    this.#errors = [];
  }

  /**
   * Valide le champ et retourne la liste des règles échouées.
   * @returns {string[]} noms des règles invalides (tableau vide si le champ est valide).
   */
  validate() {
    for (const property in this.options) {
      const value = this.options[property];
      if (!value) continue;

      const isNotValid = !new Validate(this.field)[property](value);

      if (isNotValid) {
        this.#errors.push(property);
      }
    }

    return this.#errors;
  }
}

class Validate {
  constructor(field) {
    this.field = field;
  }

  /**
   * Vérifie si le champ est alphanumérique.
   * @returns {boolean} - Retourne vrai si le champ est alphanumérique, sinon faux.
   */
  isAlphanumeric() {
    const valid = this.field.match(/[A-Za-z0-9]+|_+|-+/gm);
    return valid?.join("") === this.field;
  }

  /**
   * Vérifie si la longueur du champ est supérieure ou égale à la valeur spécifiée.
   * @param {number} value - La valeur minimale attendue.
   * @returns {boolean} - Retourne vrai si la longueur est suffisante, sinon faux.
   */
  min(value) {
    const valid = this.field.length >= value;
    return valid;
  }

  /**
   * Vérifie si la longueur du champ est inférieure ou égale à la valeur spécifiée.
   * @param {number} value - La valeur maximale attendue.
   * @returns {boolean} - Retourne vrai si la longueur est acceptable, sinon faux.
   */
  max(value) {
    const valid = this.field.length <= value;
    return valid;
  }
}

module.exports = Validator;
