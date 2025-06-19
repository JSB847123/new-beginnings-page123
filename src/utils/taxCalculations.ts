import { PropertyData, PreviousYearData, MultiUnitData, PreviousYearMultiUnitData } from "@/types/propertyTax";

// 공정시장가액비율 계산
export const calculateMarketValueRatio = (publicPrice: number, isSingleHousehold: boolean): number => {
  if (isSingleHousehold) {
    if (publicPrice <= 300000000) return 0.43;
    if (publicPrice <= 600000000) return 0.44;
    return 0.45;
  }
  return 0.60;
};

// 과세표준 계산 (과표상한제 적용)
export const calculateTaxableStandardWithCap = (
  publicPrice: number, 
  isSingleHousehold: boolean, 
  previousYearPublicPrice: number,
  taxStandardCapRate: number
): { final: number; beforeCap: number; cap: number } => {
  const marketValueRatio = calculateMarketValueRatio(publicPrice, isSingleHousehold);
  const currentYearStandard = publicPrice * marketValueRatio;

  let taxableStandardCap = 0;
  if (previousYearPublicPrice > 0) {
    const previousYearEquivalentStandard = previousYearPublicPrice * marketValueRatio;
    taxableStandardCap = previousYearEquivalentStandard + (currentYearStandard * (taxStandardCapRate / 100));
  }

  const finalTaxableStandard = previousYearPublicPrice > 0 ? Math.min(currentYearStandard, taxableStandardCap) : currentYearStandard;

  return {
    final: finalTaxableStandard,
    beforeCap: currentYearStandard,
    cap: taxableStandardCap
  };
};

// 재산세 본세 계산 (일반 주택) - 간이세율 적용
export const calculatePropertyTaxForStandard = (taxableStandard: number, isSingleHousehold: boolean, publicPrice: number): number => {
  console.log(`재산세 본세 계산: 과세표준 ${taxableStandard}원, 1세대1주택: ${isSingleHousehold}`);
  
  if (isSingleHousehold && publicPrice <= 900000000) {
    // 1세대 1주택 특례세율
    if (taxableStandard <= 60000000) {
      const result = taxableStandard * 0.0005;
      console.log(`1세대1주택 6천만원 이하: ${taxableStandard} × 0.0005 = ${result}`);
      return result;
    } else if (taxableStandard <= 150000000) {
      const result = taxableStandard * 0.001 - 30000;
      console.log(`1세대1주택 6천만원 초과 1.5억원 이하: ${taxableStandard} × 0.001 - 30,000 = ${result}`);
      return result;
    } else if (taxableStandard <= 300000000) {
      const result = taxableStandard * 0.002 - 180000;
      console.log(`1세대1주택 1.5억원 초과 3억원 이하: ${taxableStandard} × 0.002 - 180,000 = ${result}`);
      return result;
    } else {
      const result = taxableStandard * 0.0035 - 630000;
      console.log(`1세대1주택 3억원 초과: ${taxableStandard} × 0.0035 - 630,000 = ${result}`);
      return result;
    }
  }
  
  // 1세대 1주택이 아닌 경우 - 간이세율 적용
  if (taxableStandard <= 60000000) {
    const result = taxableStandard * 0.001;
    console.log(`일반 6천만원 이하 (간이세율): ${taxableStandard} × 0.001 = ${result}`);
    return result;
  } else if (taxableStandard <= 150000000) {
    const result = taxableStandard * 0.0015 - 30000;
    console.log(`일반 6천만원 초과 1.5억원 이하 (간이세율): ${taxableStandard} × 0.0015 - 30,000 = ${result}`);
    return result;
  } else if (taxableStandard <= 300000000) {
    const result = taxableStandard * 0.0025 - 180000;
    console.log(`일반 1.5억원 초과 3억원 이하 (간이세율): ${taxableStandard} × 0.0025 - 180,000 = ${result}`);
    return result;
  } else {
    const result = taxableStandard * 0.004 - 630000;
    console.log(`일반 3억원 초과 (간이세율): ${taxableStandard} × 0.004 - 630,000 = ${result}`);
    return result;
  }
};

// 표준세율 계산 - 수정된 로직
export const calculateStandardPropertyTax = (taxableStandard: number): number => {
  console.log(`표준세율 계산: 과세표준 ${taxableStandard}원`);
  
  if (taxableStandard <= 60000000) {
    const result = taxableStandard * 0.001;
    console.log(`6천만원 이하: ${taxableStandard} × 0.001 = ${result}`);
    return result;
  } else if (taxableStandard <= 150000000) {
    const result = taxableStandard * 0.0015 - 30000;
    console.log(`6천만원 초과 1억5천만원 이하: ${taxableStandard} × 0.0015 - 30,000 = ${result}`);
    return result;
  } else if (taxableStandard <= 300000000) {
    const result = taxableStandard * 0.0025 - 180000;
    console.log(`1억5천만원 초과 3억원 이하: ${taxableStandard} × 0.0025 - 180,000 = ${result}`);
    return result;
  } else {
    const result = taxableStandard * 0.004 - 630000;
    console.log(`3억원 초과: ${taxableStandard} × 0.004 - 630,000 = ${result}`);
    return result;
  }
};

// 다가구주택 재산세 계산
export const calculateMultiUnitPropertyTax = (multiUnits: MultiUnitData[], isSingleHousehold: boolean): number => {
  const totalTax = multiUnits.reduce((total, unit) => {
    const unitTax = calculatePropertyTaxForStandard(unit.taxableStandard, isSingleHousehold, unit.taxableStandard);
    return total + unitTax;
  }, 0);
  
  return Math.floor(totalTax / 10) * 10;
};

// 지역자원시설세 계산
export const calculateRegionalResourceTax = (taxableStandard: number): number => {
  if (taxableStandard <= 6000000) {
    return taxableStandard * 0.0004;
  } else if (taxableStandard <= 13000000) {
    return taxableStandard * 0.0005 - 600;
  } else if (taxableStandard <= 26000000) {
    return taxableStandard * 0.0006 - 1900;
  } else if (taxableStandard <= 39000000) {
    return taxableStandard * 0.0008 - 7100;
  } else if (taxableStandard <= 64000000) {
    return taxableStandard * 0.001 - 14900;
  } else {
    return taxableStandard * 0.0012 - 27700;
  }
};

// 다가구주택 지역자원시설세 계산
export const calculateMultiUnitRegionalResourceTax = (multiUnits: MultiUnitData[] | PreviousYearMultiUnitData[]): number => {
  const totalTax = multiUnits.reduce((total, unit) => {
    const regionalStandard = unit.regionalResourceTaxStandard || unit.taxableStandard;
    const unitTax = calculateRegionalResourceTax(regionalStandard);
    return total + unitTax;
  }, 0);
  
  return Math.floor(totalTax / 10) * 10;
};

// 전년도 재산세액 상당액 계산
export const calculatePreviousYearEquivalent = (
  previousYear: PreviousYearData,
  currentTaxableStandard: number,
  currentReductionRate: number,
  isSingleHousehold: boolean,
  publicPrice: number,
  propertyType: string
): { withoutReduction: number; withReduction: number } => {
  
  if (previousYear.actualPaidTax > 0) {
    return { 
      withoutReduction: previousYear.actualPaidTax,
      withReduction: previousYear.actualPaidTax 
    };
  }

  if (propertyType === "다가구주택" && previousYear.multiUnits.length > 0) {
    const previousTax = calculateMultiUnitPropertyTax(previousYear.multiUnits.map(unit => ({
      id: unit.id,
      taxableStandard: unit.taxableStandard,
      regionalResourceTaxStandard: unit.regionalResourceTaxStandard || unit.taxableStandard
    })), isSingleHousehold);
    
    return {
      withoutReduction: previousTax,
      withReduction: previousTax
    };
  }

  const previousCalculatedTax = previousYear.appliedRate === 'special' 
    ? calculatePropertyTaxForStandard(previousYear.taxableStandard, isSingleHousehold, publicPrice)
    : calculateStandardPropertyTax(previousYear.taxableStandard);
  
  return {
    withoutReduction: previousCalculatedTax,
    withReduction: previousCalculatedTax
  };
};
