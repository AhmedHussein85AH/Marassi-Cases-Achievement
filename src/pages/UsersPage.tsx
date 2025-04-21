import { useState } from "react";
import AppShell from "@/components/layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Filter, Search, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  initials: string;
};

const UsersPage = () => {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Administrator",
      department: "Legal",
      status: "Active",
      initials: "JS"
    },
    {
      id: 2,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Case Manager",
      department: "Operations",
      status: "Active",
      initials: "RJ"
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "Investigator",
      department: "Field Work",
      status: "Away",
      initials: "SW"
    },
    {
      id: 4,
      name: "Michael Davis",
      email: "michael.davis@example.com",
      role: "Supervisor",
      department: "Management",
      status: "Active",
      initials: "MD"
    },
    {
      id: 5,
      name: "Lisa Brown",
      email: "lisa.brown@example.com",
      role: "Case Manager",
      department: "Operations",
      status: "Inactive",
      initials: "LB"
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const handleAddUser = (newUser: { role: string; name: string; email: string; password: string; department: string; }) => {
    const user: User = {
      ...newUser,
      id: users.length + 1,
      status: 'active',
      initials: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    };
    setUsers(prev => [...prev, user]);
    toast({
      title: "User Added",
      description: `${user.name} has been added successfully.`,
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev: User[]) => {
      return prev.map(u => u.id === updatedUser.id ? updatedUser : u);
    });
    applyFilters(searchQuery, filterRole, filterDepartment, filterStatus);
    toast({
      title: "User Updated",
      description: `${updatedUser.name}'s information has been updated successfully.`,
    });
  };

  const applyFilters = (search: string, role: string, department: string, status: string, usersToFilter = users) => {
    const lowercaseQuery = search.toLowerCase();
    let filtered = usersToFilter;

    if (search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery) ||
        user.department.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }

    if (department) {
      filtered = filtered.filter(user => user.department === department);
    }

    if (status) {
      filtered = filtered.filter(user => user.status === status);
    }

    setFilteredUsers(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filterRole, filterDepartment, filterStatus);
  };

  const clearFilters = () => {
    setFilterRole("");
    setFilterDepartment("");
    setFilterStatus("");
    applyFilters(searchQuery, "", "", "");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case "Away":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Away</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage system users and their permissions
            </p>
          </div>
          
          <AddUserDialog onAddUser={handleAddUser} />
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <CardTitle>System Users</CardTitle>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Filters</h4>
                        {(filterRole || filterDepartment || filterStatus) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={clearFilters}
                          >
                            Clear all
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <select
                          className="w-full rounded-md border border-input px-3 py-2 text-sm"
                          value={filterRole}
                          onChange={(e) => {
                            setFilterRole(e.target.value);
                            applyFilters(searchQuery, e.target.value, filterDepartment, filterStatus);
                          }}
                        >
                          <option value="">All Roles</option>
                          <option value="Administrator">Administrator</option>
                          <option value="Case Manager">Case Manager</option>
                          <option value="Investigator">Investigator</option>
                          <option value="Supervisor">Supervisor</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <select
                          className="w-full rounded-md border border-input px-3 py-2 text-sm"
                          value={filterDepartment}
                          onChange={(e) => {
                            setFilterDepartment(e.target.value);
                            applyFilters(searchQuery, filterRole, e.target.value, filterStatus);
                          }}
                        >
                          <option value="">All Departments</option>
                          <option value="Legal">Legal</option>
                          <option value="Operations">Operations</option>
                          <option value="Field Work">Field Work</option>
                          <option value="Management">Management</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                          className="w-full rounded-md border border-input px-3 py-2 text-sm"
                          value={filterStatus}
                          onChange={(e) => {
                            setFilterStatus(e.target.value);
                            applyFilters(searchQuery, filterRole, filterDepartment, e.target.value);
                          }}
                        >
                          <option value="">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Away">Away</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              Edit user
                            </DropdownMenuItem>
                            <DropdownMenuItem>Reset password</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Deactivate user
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {editingUser && (
        <EditUserDialog 
          user={editingUser} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          onUpdateUser={handleUpdateUser}
        />
      )}
    </AppShell>
  );
};

export default UsersPage;
