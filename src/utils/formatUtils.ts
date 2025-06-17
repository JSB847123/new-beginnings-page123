
// 숫자 포맷팅 함수 (천 단위 콤마)
export const formatNumberWithCommas = (value: number): string => {
  return value.toLocaleString('ko-KR');
};

// 숫자 입력 처리 함수
export const parseNumberFromInput = (value: string): number => {
  return Number(value.replace(/,/g, ''));
};
