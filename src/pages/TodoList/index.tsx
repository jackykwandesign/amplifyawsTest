import React, { useEffect, useState } from "react";
import { listTodos } from "../../graphql/queries";
import {
	createTodo as createTodoMutation,
	deleteTodo as deleteTodoMutation,
} from "../../graphql/mutations";
import { API } from "aws-amplify";

const initialFormState = { name: "", description: "" };
interface Todo {
	id: string;
	name: string;
	description: string;
}
function TodoList() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [formData, setFormData] = useState<Partial<Todo>>(initialFormState);

	useEffect(() => {
		fetchTodos();
	}, []);

	async function fetchTodos() {
		const apiData = await API.graphql({ query: listTodos });
		setTodos((apiData as any).data.listTodos.items);
	}

	async function createTodo() {
		if (!formData.name || !formData.description) return;
		const apiResult = await API.graphql({
			query: createTodoMutation,
			variables: { input: formData },
		});
		console.log("apiResult", apiResult);
		const newTodo = (apiResult as any).data.createTodo as Todo;
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
				value={formData.description}
			/>
			<button onClick={createTodo}>Create Todo</button>
			<div style={{ marginBottom: 30 }}>
				{todos.length === 0
					? "No data"
					: todos.map((todo,i) => (
							<div style={{
                                display:"flex",
                                flexDirection:"row",
                                justifyContent:"center",
                                alignItems:"center",
                                columnGap:"12px",
                            }} key={todo.id}>
                                <h2>{`${i+1}. `}</h2>
								<h2>{todo.name}</h2>
								<p>{todo.description}</p>
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
