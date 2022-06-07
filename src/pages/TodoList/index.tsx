import React, { useEffect, useState } from "react";
import { listTodos } from "../../graphql/queries";
import {
	createTodo as createTodoMutation,
	deleteTodo as deleteTodoMutation,
} from "../../graphql/mutations";
import { API, Storage } from "aws-amplify";
import { Todo } from "../../API";

const initialFormState = { name: "", description: "" };

function TodoList() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [formData, setFormData] = useState<Partial<Todo>>(initialFormState);

	useEffect(() => {
		fetchTodos();
	}, []);

	async function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const { files } = e.target;
        console.log("files", files)
		if (!files || files?.length < 1) return;
		const file = files[0];
		setFormData({ ...formData, image: file.name });
		await Storage.put(file.name, file);
        console.log("uploaded")
		// fetchTodos();
	}

	async function fetchTodos() {
		const apiData = await API.graphql({ query: listTodos });
		const newTodos = (apiData as any).data.listTodos.items as Todo[];
		await Promise.all(
			newTodos.map(async (todo) => {
				if (todo.image) {
					const image = await Storage.get(todo.image);
					todo.image = image;
				}
				return todo;
			})
		);
		setTodos(newTodos);
	}

	async function createTodo() {
        console.log("formData", formData)
		if (!formData.name || !formData.description) return;
		const apiResult = await API.graphql({
			query: createTodoMutation,
			variables: { input: formData },
		});
		const newTodo = (apiResult as any).data.createTodo as Todo;
        console.log("apiResult", apiResult)
		if (newTodo.image) {
			const image = await Storage.get(newTodo.image);
			newTodo.image = image;
		}
        console.log("newTodo", newTodo)
		setTodos([...todos, newTodo]);
		setFormData(initialFormState);
	}

	async function deleteTodo({ id }: { id: string }) {
		const newTodosArray = todos.filter((todo) => todo.id !== id);
		setTodos(newTodosArray);
		await API.graphql({
			query: deleteTodoMutation,
			variables: { input: { id } },
		});
	}
	return (
		<div>
			<h1>My Todos App</h1>
			<input
				onChange={(e) =>
					setFormData({ ...formData, name: e.target.value })
				}
				placeholder="Todo name"
				value={formData.name}
			/>
			<input
				onChange={(e) =>
					setFormData({ ...formData, description: e.target.value })
				}
				placeholder="Todo description"
				value={formData.description ?? ""}
			/>
			<input type="file" onChange={(e) => onImageUpload(e)} />
			<button onClick={createTodo}>Create Todo</button>
			<div style={{ marginBottom: 30 }}>
				{todos.length === 0
					? "No data"
					: todos.map((todo, i) => (
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									columnGap: "12px",
								}}
								key={todo.id}
							>
								<h2>{`${i + 1}. `}</h2>
								<h2>{todo.name}</h2>
								<p>{todo.description}</p>
								{todo.image && (
									<img
										src={todo.image}
										style={{ width: 400 }}
									/>
								)}
								<button onClick={() => deleteTodo(todo)}>
									Delete todo
								</button>
							</div>
					  ))}
			</div>
		</div>
	);
}

export default TodoList;
