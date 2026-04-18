
import UsersPage from "@/pages/UsersPage";
import { getUsers } from "@/server/users";

export default async function page() {
  let usersData: { users: { data: any[] }; totalCount: number } = { users: { data: [] }, totalCount: 0 };
  try {
    usersData = await getUsers();
    console.log(usersData)
  } catch {
    // render with empty state if fetch fails
  }
  return <UsersPage users={usersData.users.data ?? []} totalCount={usersData.totalCount ?? 0} />;
}

