/* eslint-disable @typescript-eslint/no-unused-vars */
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export interface PronunciationAssessmentData {
    category: string;
    score: number;
}

interface Props {
    pronunciationData: PronunciationAssessmentData[];
}

const PronunciationChart = ({ pronunciationData }: Props) => {
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Assessment</CardTitle>
                    <CardDescription className="font-semibold">
                        Pronunciation Assessment Score
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={pronunciationData}
                            margin={{
                                top: 20,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                className="font-semibold"
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="score"
                                fill="hsl(var(--chart-1))"
                                radius={8}
                            >
                                <LabelList
                                    position="top"
                                    offset={3}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none"></div>
                    <div className="leading-none text-muted-foreground">
                        All the scores are out of 100
                    </div>
                </CardFooter>
            </Card>
        </>
    );
};

export default PronunciationChart;
