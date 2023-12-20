import { KeyboardEvent, useRef, useState } from "react"
import { TTodoRestItem } from "./App"

type TProps = {
    todolist: TTodoRestItem[],
    setTodolist: (todolist: TTodoRestItem[]) => void
}

export default function (props: TProps) {
    const { setTodolist } = props

    const ref = useRef<HTMLLIElement>(null)
    const tagRef = useRef<HTMLInputElement>(null)
    const [inputValue, setInputValue] = useState('')

    async function updateTodoList() {
        const response = await fetch("http://localhost:3000/item")
        const data = await response.json()
        setTodolist(data)
    }

    const onKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue !== '') {
            const tags = tagRef.current?.value.split(',').map(tag => tag.trim()) || []
            setInputValue('')
            tagRef.current!.value = ''

            const request = await fetch("http://localhost:3000/item", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo: inputValue, tags })
            })

            if (ref.current) {
                ref.current.className = 'synced'
            }

            updateTodoList()
        }
    }

    return <div>
        <input className="input-action" type="text" placeholder="o que você fará depois?" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={onKeyDown} />
        <input ref={tagRef} className="input-tag" type="text" placeholder="Tag" />
    </div>
}