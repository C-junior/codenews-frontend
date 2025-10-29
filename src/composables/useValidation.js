/**
 * Composable para validações do sistema
 */
export function useValidation() {
  /**
   * Valida CPF
   * @param {string} cpf - CPF a ser validado
   * @returns {boolean} - True se válido
   */
  const validateCPF = (cpf) => {
    if (!cpf) return false;
    
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Algoritmo de validação de CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    
    return remainder === parseInt(cleanCPF.charAt(10));
  };
  
  /**
   * Valida campo obrigatório
   * @param {any} value - Valor a ser validado
   * @returns {boolean} - True se válido
   */
  const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  };
  
  /**
   * Valida temperatura corporal (30-45°C)
   * @param {number|string} temp - Temperatura a ser validada
   * @returns {boolean} - True se válida
   */
  const validateTemperatura = (temp) => {
    const temperatura = parseFloat(temp);
    return !isNaN(temperatura) && temperatura >= 30 && temperatura <= 45;
  };
  
  /**
   * Valida pressão arterial
   * @param {number|string} sistolica - Pressão sistólica
   * @param {number|string} diastolica - Pressão diastólica
   * @returns {boolean} - True se válida
   */
  const validatePressao = (sistolica, diastolica) => {
    const sys = parseInt(sistolica);
    const dia = parseInt(diastolica);
    return !isNaN(sys) && !isNaN(dia) && sys > 0 && dia > 0 && sys > dia && sys <= 300 && dia <= 200;
  };
  
  /**
   * Valida número
   * @param {any} value - Valor a ser validado
   * @param {number} min - Valor mínimo (opcional)
   * @param {number} max - Valor máximo (opcional)
   * @returns {boolean} - True se válido
   */
  const validateNumber = (value, min = null, max = null) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };
  
  /**
   * Valida inteiro
   * @param {any} value - Valor a ser validado
   * @param {number} min - Valor mínimo (opcional)
   * @param {number} max - Valor máximo (opcional)
   * @returns {boolean} - True se válido
   */
  const validateInteger = (value, min = null, max = null) => {
    const num = parseInt(value);
    if (isNaN(num) || !Number.isInteger(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };
  
  return {
    validateCPF,
    validateRequired,
    validateTemperatura,
    validatePressao,
    validateNumber,
    validateInteger
  };
}