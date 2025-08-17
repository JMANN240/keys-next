'use client';

import { useCallback, useEffect, useState } from "react";
import KeyValueComponent, { KeyValue } from "./key_value";
import { useApiKey } from "./api_key_provider";
import NewKeyValueComponent from "./new_key_value";

export default function KeyValues() {
	const { apiKey } = useApiKey();

	const [keys, setKeys] = useState<KeyValue[] | null>(null);

	const loadKeys = useCallback(async () => {
		if (apiKey) {
			const key_values_response = await fetch('https://api.keys.kent.software/key_value', {
				headers: {
					'Authorization': `Bearer ${apiKey}`,
				},
			});

			if (key_values_response.status == 200) {
				const key_values_json = await key_values_response.json();
	
				setKeys(key_values_json);
			} else {
				setKeys(null);
			}
		} else {
			setKeys(null);
		}
	}, [apiKey]);

	useEffect(() => {
		loadKeys();
	}, [loadKeys]);

	return (
		<>
			{
				keys &&
				<div className="border-1 p-4 mt-6 w-2xl">
					<h3 className="text-lg mb-4">Keys for {apiKey}</h3>
					<ul>
						{
							keys?.map(key_value => {
								return (
									<li key={key_value.key} className="mb-3">
										<KeyValueComponent key_value={key_value} onUpdate={loadKeys} onDelete={loadKeys} />
									</li>
								);
							})
						}
						<li>
							<NewKeyValueComponent onCreate={loadKeys} />
						</li>
					</ul>
				</div>
			}
		</>
	);
}