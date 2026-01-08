import { TutorialTabs } from "@/components/TutorialTabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQ_DATA } from "@/data/faq";

const FaqPage = () => {
  return (
    <div className="px-4 py-8 md:max-w-3xl md:mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          Câu hỏi thường gặp
        </h1>
        <p className="text-sm text-[#a8c5bb] opacity-70">
          Hướng dẫn & giải đáp khi sử dụng ứng dụng tính điểm
        </p>
      </div>
      <TutorialTabs />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-[#f2c94c]">
            FAQ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem key={index} value={`${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {Array.isArray(faq.answer) ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {faq.answer.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{faq.answer}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaqPage;
