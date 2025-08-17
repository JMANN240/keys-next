import ApiKeyProvider from "@/components/api_key_provider";
import KeyValues from "@/components/key_values";

export default function Home() {
	return (
		<>
			<h1 className="text-5xl mb-2">{ "Be careful with your API key." }</h1>
			<h2 className="text-lg font-bold">{ "Possession of your key grants full authorization of your key-value store." }</h2>
			<h2 className="text-lg font-bold mb-6">{ "We don't store it anywhere. If you lose it, it's gone forever." }</h2>
			<ApiKeyProvider>
				<KeyValues />
			</ApiKeyProvider>
		</>
	);
}
