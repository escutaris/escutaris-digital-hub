/**
 * Chaves de comportamento da comunidade.
 * Mudar aqui vale para o site inteiro; nada mais precisa ser editado.
 */

/**
 * Exigir conta para baixar material?
 *
 *   true  = visitante clica em "Baixar" e recebe o convite para entrar na comunidade
 *   false = qualquer pessoa baixa direto, sem conta
 *
 * Decisão de 31/07/2026: aberto (false), "por enquanto" — na época o cadastro
 * por e-mail e senha não tinha recuperação de senha, e quem esquecesse ficava sem saída.
 *
 * Decisão de 08/08/2026: fechado (true). O objetivo passou a ser captura de lead.
 * A senha saiu de cena: agora entra-se por Google ou por link enviado no e-mail,
 * então não existe mais senha para esquecer. Voltar atrás é trocar esta linha para false.
 */
export const EXIGIR_LOGIN_PARA_BAIXAR = true;
