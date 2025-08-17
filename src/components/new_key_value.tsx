import { ChangeEvent, FormEvent, useState } from "react";
import { useApiKey } from "./api_key_provider";

export default function NewKeyValueComponent({
	onCreate,
}: Readonly<{
	onCreate?: () => void,
}>) {
	const { apiKey } = useApiKey();

	const [key, setKey] = useState('');
	const [value, setValue] = useState('');

	function handleKeyChange(e: ChangeEvent<HTMLInputElement>) {
		setKey(e.target.value);
	}

	function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
		setValue(e.target.value);
	}

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		createKeyValue();
	}

	async function createKeyValue() {
		const response = await fetch(`https://api.keys.kent.software/key_value/${key}`, {
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				value,
			}),
		});

		setKey('');
		setValue('');

		if (onCreate && response.status === 200) {
			onCreate();
		}
	}

	return (
		<form className="flex gap-2 items-center border-1 p-2" onSubmit={onSubmit}>
			<input type="text" placeholder="Key" value={key} onChange={handleKeyChange} className="border-1 px-2 py-1 grow" maxLength={256} />
			<input type="text" placeholder="Value" value={value} onChange={handleValueChange} className="border-1 px-2 py-1 grow" maxLength={256} />
			<button className="border-1 px-2 py-1 disabled:text-gray-500 disabled:border-gray-500" onClick={createKeyValue} disabled={key === '' || value == ''}>Create</button>
		</form>
	);
}
