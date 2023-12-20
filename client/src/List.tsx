import { KeyboardEvent, MouseEvent } from "react"
import { TTodoRestItem } from "./App"

type TProps = {
    todolist: TTodoRestItem[],
    setTodolist: (todolist: TTodoRestItem[]) => void
}

export default function (props: TProps) {
    const { todolist, setTodolist } = props

    const removeItem = async (event: MouseEvent<HTMLButtonElement>) => {
        const id = Number(event.currentTarget.dataset.id) as number
        const li = event.currentTarget.closest('li') as HTMLLIElement
        li.className = 'pending'
        await fetch(`http://localhost:3000/item/${id}`, { method: 'DELETE' })
        await fetch("http://localhost:3000/item")
                .then(response => response.json())
                .then(data => setTodolist(data))
    }

    const keyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const li = event.currentTarget.closest('li') as HTMLLIElement
            li.className = 'pending'
            const value = event.currentTarget.value
            const id = event.currentTarget.dataset.id
            const request = await fetch(`http://localhost:3000/item/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo: value })
            })
            const response = await request.json()
            console.log(response)
            li.className = 'synced'
        }
    }

    return <>
        <ul>
            {todolist.map((todo, _key) =>
                <li ref={todo.ref} key={todo.id} data-id={todo.id} className={todo.id < 0 ? "pending" : "synced"}>
                    <input type="text" onKeyDown={keyDown} data-id={todo.id} defaultValue={todo.text} />
                    <span>{todo.tags.join(', ')}</span>
                    <button data-id={todo.id} onClick={removeItem}>remove</button>
                </li>
            )}
        </ul>
    </>
}