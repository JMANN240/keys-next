'use client'

import { ChangeEvent, createContext, useContext, useState } from 'react'

interface ApiKeyContextValue {
	apiKey: string | undefined;
	setApiKey: (key: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextValue | undefined>(undefined);

export default function ApiKeyProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [apiKey, setApiKey] = useState<string>('');

	function handleApikeyChange(e: ChangeEvent<HTMLInputElement>) {
		setApiKey(e.target.value);
	}

	async function generateApiKey() {
		const api_key_response = await fetch('https://api.keys.kent.software/api_key', {
			headers: {
				'Authorization': `Bearer ${apiKey}`,
			},
			method: 'POST',
		});

		if (api_key_response.status == 200) {
			const api_key_json = await api_key_response.json();

			setApiKey(api_key_json.api_key);
		}
	}

	const input =
		<div className='w-2xl flex gap-2'>
			<input type="text" value={apiKey} onChange={handleApikeyChange} className="border-1 px-2 py-1 grow" placeholder='API Key' />
			{
				apiKey == '' &&
				<button className='border-1 px-2 py-1' onClick={generateApiKey}>Generate</button>
			}
		</div>;

	return (
		<ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
			{input}
			{children}
		</ApiKeyContext.Provider>
	);
}

export function useApiKey() {
	const context = useContext(ApiKeyContext);
	if (!context) throw new Error("useApiKey must be used within an ApiKeyProvider");
	return context;
}

