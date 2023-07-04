import { useState } from "react"

function useInput(obj) {
    const [value, setValue] = useState(obj);
    return { value, onChange: (e) => { setValue(e.target.value) } }
}

export default useInput