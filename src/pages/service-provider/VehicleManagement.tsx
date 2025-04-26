import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2, Pencil, Save, Trash2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  vin: string;
  image?: string | File;
}

const VehicleManagement = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [newVehicle, setNewVehicle] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<
    Partial<Vehicle & { image?: File }>
  >({});

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/vehicle`, {
        headers: { Authorization: token },
      });

      if (response.data.success) {
        setVehicles(response.data.vehicles);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newVehicle).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.post(`${backendUrl}/api/vehicle`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Vehicle added successfully");
        setNewVehicle({
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          vin: "",
        });
        setSelectedImage(null);
        fetchVehicles();
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle");
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle.id);
    setEditValues({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      vin: vehicle.vin,
    });
  };

  const handleCancelEdit = () => {
    setEditingVehicle(null);
    setEditValues({});
  };

  const handleUpdateVehicle = async (vehicleId: string) => {
    try {
      const formData = new FormData();
      Object.entries(editValues).forEach(([key, value]) => {
        if (value && key !== "image") {
          formData.append(key, value.toString());
        }
      });

      if (editValues.image) {
        formData.append("image", editValues.image);
      }

      const response = await axios.put(
        `${backendUrl}/api/vehicle/${vehicleId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Vehicle updated successfully");
        handleCancelEdit();
        fetchVehicles();
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Failed to update vehicle");
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;

    try {
      const response = await axios.delete(
        `${backendUrl}/api/vehicle/${vehicleId}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        toast.success("Vehicle deleted successfully");
        setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle");
    }
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditValues((prev) => ({ ...prev, image: file }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newVehicle.brand}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, brand: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newVehicle.model}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, model: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newVehicle.year}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      year: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={newVehicle.vin}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, vin: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image">Vehicle Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedImage(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
            <Button type="submit">Add Vehicle</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="w-16 h-16 overflow-hidden rounded-md">
                      {vehicle.image ? (
                        <img
                          src={
                            typeof vehicle.image === "string"
                              ? vehicle.image
                              : URL.createObjectURL(vehicle.image)
                          }
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100">
                          No image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingVehicle === vehicle.id ? (
                      <Input
                        value={editValues.brand}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            brand: e.target.value,
                          })
                        }
                      />
                    ) : (
                      vehicle.brand
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVehicle === vehicle.id ? (
                      <Input
                        value={editValues.model}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            model: e.target.value,
                          })
                        }
                      />
                    ) : (
                      vehicle.model
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVehicle === vehicle.id ? (
                      <Input
                        type="number"
                        value={editValues.year}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            year: parseInt(e.target.value),
                          })
                        }
                      />
                    ) : (
                      vehicle.year
                    )}
                  </TableCell>
                  <TableCell>
                    {editingVehicle === vehicle.id ? (
                      <Input
                        value={editValues.vin}
                        onChange={(e) =>
                          setEditValues({ ...editValues, vin: e.target.value })
                        }
                      />
                    ) : (
                      vehicle.vin
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingVehicle === vehicle.id ? (
                        <>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateVehicle(vehicle.id)}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(vehicle)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleManagement;
