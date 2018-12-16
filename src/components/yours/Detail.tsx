import React, { useState } from 'react';

interface DetailInput {
    fieldName: string;
    initialValue: string;
    storeData: (field: string, value: string, setEdit: (status: boolean) => void) => void;
}

export default function Detail({ fieldName, initialValue, storeData }: DetailInput) {
    const [value, setValue] = useState(initialValue);
    const [edit, setEdit] = useState(false);

    return (
        <>{edit
            ? (
                <div>
                    <input value={value} autoFocus onBlur={() => storeData(fieldName, value, setEdit)} onChange={e => setValue(e.target.value)} />
                </div>
            )
            : <div onClick={() => setEdit(true)}>{value ? value : 'Klikk her for å legge til'}</div>
        }</>
    );
}
