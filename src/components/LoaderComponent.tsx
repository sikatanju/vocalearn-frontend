import HashLoader from "react-spinners/HashLoader";

interface Props {
    isLoading: boolean;
}

const LoaderComponent = ({ isLoading }: Props) => {
    // Helper to get the full HSL color
    const getTailwindColor = (variable: string) => {
        const hsl = getComputedStyle(document.documentElement).getPropertyValue(
            variable
        );
        return `hsl(${hsl})`;
    };

    return (
        <>
            {isLoading && (
                <HashLoader
                    color={getTailwindColor("--foreground")}
                    cssOverride={{
                        marginTop: "2rem",
                    }}
                />
            )}
        </>
    );
};

export default LoaderComponent;
