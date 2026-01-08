import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TUTORIAL_DATA } from "@/data/tutorial";

export const TutorialTabs = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest text-[#f2c94c]">
          Hướng dẫn sử dụng
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2 space-y-4">
        <Tabs defaultValue={TUTORIAL_DATA[0].mode} className="space-y-4">
          <TabsList>
            {TUTORIAL_DATA.map((tut) => (
              <TabsTrigger
                key={tut.mode}
                value={tut.mode}
                className="text-xs font-black uppercase"
              >
                {tut.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {TUTORIAL_DATA.map((tut) => (
            <TabsContent key={tut.mode} value={tut.mode}>
              {tut.image && (
                <img
                  src={tut.image}
                  alt={tut.title}
                  className="w-full rounded-xl border border-white/10"
                />
              )}
              <ul className="list-disc pl-5 space-y-1 text-sm text-[#a8c5bb]">
                {tut.description.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
