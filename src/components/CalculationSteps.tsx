
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CalculationSteps = () => {
  const steps = [
    {
      step: "1단계",
      title: "현년도 산출세액 계산",
      description: "과세표준×세율, 비과세 감면율 및 소유비율 적용 등 당해연도 산출세액 계산",
      subSteps: [
        "과표계산(비과세 과세표준 제외)",
        "재산세(주택)은 과표상한제 적용", 
        "(누진)세율적용 세액계산",
        "주택분은 건물·토지 세액안분",
        "감면율적용 (주택분 건물·토지별 감면)",
        "소유비율적용(주택분 건물·토지별 비율)",
        "건물·토지세액 합산",
        "(다가구) 구별합산"
      ]
    },
    {
      step: "2단계", 
      title: "전년도세액 계산",
      description: "세부담상한에 적용할 전년도 상당세액 계산",
      subSteps: [
        "유사지번: 연결된 유사지번이 있으면 유사지번세액으로 결정",
        "실부과액: 유사지번이 없고, 변동결정 항목 모두 변동이 없으면 전년도 실부과액으로 결정",
        "산출세액: 유사지번이 없고, 변동결정 항목 중 하나라도 변동이 있으면 현시점대장으로 전년도 산출세액을 계산하여 결정"
      ]
    },
    {
      step: "3단계",
      title: "세부담 상한세액 계산", 
      description: "[1단계의 현년도 산출세액]과 [2단계의 전년도 상당세액 × 세부담상한율]중 작은 금액으로 계산"
    },
    {
      step: "4단계",
      title: "부과연세액 계산",
      description: "일반적으로는 3단계의 세부담의상한세액과 동일하나, 임대주택 등 부과세액 감면이면 [3단계의 세부담상한액×(1-감면율)]로 연세액 계산"
    },
    {
      step: "5단계", 
      title: "부과세액 계산",
      description: "소액 징수면제, 주택분 7월은 반기세액, 9월은 차감세액, 그 외는 연세액"
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
        <CardTitle className="text-xl">재산세 계산 단계</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="border-l-4 border-emerald-500 pl-4">
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-emerald-100 text-emerald-800 font-semibold">
                  {step.step}
                </Badge>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-gray-600 mb-3">{step.description}</p>
              {step.subSteps && (
                <ul className="space-y-1 text-sm text-gray-500">
                  {step.subSteps.map((subStep, subIndex) => (
                    <li key={subIndex} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                      {subStep}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationSteps;
