"use client"

import type React from "react"

import { useState } from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"


type StaffMember = {
  id: string
  name: string
  email: string
  password: string
}

export default function AdminDashboard() {
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: "1", name: "John Doe", email: "john@mealshare.com", password: "password123" },
    { id: "2", name: "Jane Smith", email: "jane@mealshare.com", password: "password456" },
  ])
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "" })
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)
  const [bulkStaffInput, setBulkStaffInput] = useState("")
  const [editedStaff, setEditedStaff] = useState<{ [key: string]: StaffMember }>({})

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/admin/get`);
        setAdminEmail(response.data.user.email);
        console.log(response.data.user.email);
        // setAdminPassword(response.data.user.password);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    }
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/admin/all-staff`);
        setStaffMembers(response.data.staff);
        console.log(response.data.staff);

      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    }
    fetchStaffData()
    fetchAdminData()
    // const storedUser = localStorage.getItem("user")
  },[])

  const handleAdminUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await axios.post(`${API_URL}/admin/admin/update`,{email:adminEmail,password:adminPassword});
    setAdminEmail(res.data.user.email)
    // setAdminPassword(res.data.user.password)


    // In a real app, this would trigger an API call to update admin credentials
    console.log("Admin credentials updated")
    toast.success("Bulk Staff Created");

    toast({
      title: "Admin Credentials Updated",
      description: "Your admin credentials have been successfully updated.",
    })
    // setAdminPassword("")
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would trigger an API call to add a new staff member
    const newStaffMember: StaffMember = {
      id: String(staffMembers.length + 1),
      name: newStaff.name,
      email: newStaff.email,
      password: newStaff.password,
    }
    setStaffMembers([...staffMembers, newStaffMember])
    setNewStaff({ name: "", email: "", password: "" })
    const res = await axios.post(`${API_URL}/admin/admin/staff-signup`,{name : newStaffMember.name,email : newStaffMember.email,password : newStaffMember.password});
    // setAdminEmail(res.data.user.email)
    setIsAddStaffOpen(false)

    toast({
      title: "Staff Member Added",
      description: `${newStaffMember.name} has been added to the staff list.`,
    })
  }

  const handleBulkStaffCreation = () => {
    const newStaffMembers = bulkStaffInput.split("\n").map((line, index) => {
      const [email, password] = line.split(",").map((item) => item.trim())
      return {
        id: String(staffMembers.length + index + 1),
        name: email.split("@")[0],
        email,
        password,
      }
    })
    setStaffMembers([...staffMembers, ...newStaffMembers])
    setBulkStaffInput("")
    toast.success("Bulk Staff Created");
  //   toast({
  //     title: "Bulk Staff Created",
  //     description: `${newStaffMembers.length} new staff members have been added.`,
  //   })
  }

  const handleStaffUpdate = (id: string, field: keyof StaffMember, value: string) => {
    setEditedStaff((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const handleConfirmStaffUpdate = (id: string) => {
    if (editedStaff[id]) {
      setStaffMembers(staffMembers.map((staff) => (staff.id === id ? { ...staff, ...editedStaff[id] } : staff)))
      setEditedStaff((prev) => {
        const { [id]: _, ...rest } = prev
        return rest
      })
      toast({
        title: "Staff Member Updated",
        description: `The staff member's information has been updated.`,
      })
    }
  }

  const handleDeleteStaff = (id: string) => {
    setStaffMembers(staffMembers.filter((staff) => staff.id !== id))
    toast({
      title: "Staff Member Deleted",
      description: `The staff member has been removed from the list.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminUpdate} className="space-y-4">
            <div>
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="admin-password">New Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <Button type="submit">Update Admin Credentials</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <Input
                      value={editedStaff[staff.id]?.name ?? staff.name}
                      onChange={(e) => handleStaffUpdate(staff.id, "name", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedStaff[staff.id]?.email ?? staff.email}
                      onChange={(e) => handleStaffUpdate(staff.id, "email", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="password"
                      value={editedStaff[staff.id]?.password ?? staff.password}
                      onChange={(e) => handleStaffUpdate(staff.id, "password", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleConfirmStaffUpdate(staff.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteStaff(staff.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 space-y-4">
            <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
              <DialogTrigger asChild>
                <Button>Add New Staff</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div>
                    <Label htmlFor="staff-name">Name</Label>
                    <Input
                      id="staff-name"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff-email">Email</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff-password">Password</Label>
                    <Input
                      id="staff-password"
                      type="password"
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit">Add Staff Member</Button>
                </form>
              </DialogContent>
            </Dialog>
            <div>
              <Label htmlFor="bulk-staff">Bulk Staff Creation</Label>
              <Textarea
                id="bulk-staff"
                placeholder="Enter email,password (one per line)"
                value={bulkStaffInput}
                onChange={(e) => setBulkStaffInput(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleBulkStaffCreation}>Create Bulk Staff</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

