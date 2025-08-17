import { ChangeEvent, FormEvent, useState } from "react";
import { useApiKey } from "./api_key_provider";

export interface KeyValue {
	key: string,
	value: string,
}

export default function KeyValueComponent({
	key_value,
	onUpdate,
	onDelete,
}: Readonly<{
	key_value: KeyValue,
	onUpdate?: () => void,
	onDelete?: () => void,
}>) {
	const { apiKey } = useApiKey();

	const [value, setValue] = useState(key_value.value);

	function handleValueChange(e: ChangeEvent<HTMLInputElement>) {
		setValue(e.target.value)
	}

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		updateKeyValue();
	}

	async function updateKeyValue() {
		const response = await fetch(`https://api.keys.kent.software/key_value/${key_value.key}/${value}`, {
			headers: {
				'Authorization': `Bearer ${apiKey}`,
			},
			method: 'POST',
		});

		if (onUpdate && response.status === 200) {
			onUpdate();
		}
	}

	async function deleteKeyValue() {
		const response = await fetch(`https://api.keys.kent.software/key_value/${key_value.key}`, {
			headers: {
				'Authorization': `Bearer ${apiKey}`,
			},
			method: 'DELETE',
		});

		if (onDelete && response.status === 200) {
			onDelete();
		}
	}

	return (
		<form className="flex gap-2 items-center border-1 p-2" onSubmit={onSubmit}>
			<span className="px-2 py-1">{key_value.key}</span>
			<input type="text" placeholder="Value" value={value} onChange={handleValueChange} className="border-1 px-2 py-1 grow" maxLength={256} />
			<button className="border-1 px-2 py-1 disabled:text-gray-500 disabled:border-gray-500" onClick={updateKeyValue} disabled={key_value.value === value}>Update</button>
			<button className="border-1 px-2 py-1 text-red-500 border-red-500" onClick={deleteKeyValue}>Delete</button>
		</form>
	);
}
