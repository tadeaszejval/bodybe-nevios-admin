"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Button,
  CircularProgress
} from "@mui/material";
import { DashboardHeader } from "../../../components/DashboardHeader";
import { PageContainer } from "../../../components/PageContainer";
import { NeviosFormPaper } from "../../../components/nevios/NeviosFormPaper";
import { TbArrowLeft, TbTicket, TbPencil } from "react-icons/tb";
import { NeviosTwoColumnFormContainer } from "../../../components/nevios/NeviosFormContainer";
import NeviosSimpleSearch from "../../../components/nevios/NeviosSimpleSearch";

// Sample customer data
const SAMPLE_CUSTOMERS = [
  { id: "1", email: "0135jara@gmail.com", firstName: "Jana", lastName: "Nováková" },
  { id: "2", email: "13valaskova2@gmail.com", firstName: "Martina", lastName: "Valášková" },
  { id: "3", email: "1biker1@seznam.cz", firstName: "Petr", lastName: "Novotný" },
  { id: "4", email: "23jirka33@gmail.com", firstName: "Jiří", lastName: "Svoboda" },
  { id: "5", email: "24tomas@gmail.com", firstName: "Tomáš", lastName: "Dvořák" },
  { id: "6", email: "29veru.vodickova@gmail.com", firstName: "Veronika", lastName: "Vodičková" },
  { id: "7", email: "2anmassa6@libero.it", firstName: "Anna", lastName: "Massa" },
  { id: "8", email: "3.r@seznam.cz", firstName: "Roman", lastName: "Procházka" },
  { id: "9", email: "30vasi@seznam.cz", firstName: "Vasil", lastName: "Horváth" },
  { id: "10", email: "321@centrum.cz", firstName: "Jan", lastName: "Černý" }
];

export function CreateOrder() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Filter customers based on search query
  const filteredCustomers = searchQuery 
    ? SAMPLE_CUSTOMERS.filter(customer => 
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const handleSelectCustomer = (customer) => {
    console.log("Selected customer:", customer);
    setSelectedCustomer(customer);
  };
  
  const handleCreateCustomer = () => {
    console.log("Create new customer");
    router.push("/dashboard/customers/create");
  };
  
  return (
    <PageContainer
      customSx={{
        maxWidth: "950px"
      }}
    >
      
      <DashboardHeader
        title="New Order"
        icon={<TbTicket size={24} />}
        actions={
          <Button 
            size="small" 
            variant="outlined" 
            color="secondary" 
            startIcon={<TbArrowLeft />}
            onClick={() => router.push("/dashboard/orders")}
          >
            Back to Orders
          </Button>
        }
      />
      <NeviosTwoColumnFormContainer
        mainContent={
            <>
                <NeviosFormPaper title="Products">
                    
                </NeviosFormPaper>
                <NeviosFormPaper title="Pricing">
                    
                </NeviosFormPaper>
            </>
        }
        sideContent={
          <>
            <NeviosFormPaper title="Notes" icon={<TbPencil />} description="Notes are private and won't be shared with the customer.">

            </NeviosFormPaper>
            <NeviosFormPaper title="Source">

            </NeviosFormPaper>
            <NeviosFormPaper 
              title="Customer" 
              description={selectedCustomer ? `Order for ${selectedCustomer.firstName} ${selectedCustomer.lastName}` : "Search for a customer or create a new one"}
            >
              <NeviosSimpleSearch 
                placeholder="Search customers by email or name"
                results={filteredCustomers}
                onSearch={setSearchQuery}
                onResultSelect={handleSelectCustomer}
                getOptionLabel={(customer) => customer.email}
                actionButton={{
                  label: "Create a new customer",
                  onClick: handleCreateCustomer
                }}
              />
            </NeviosFormPaper>
          </>
        }
        footerContent={
          <Button 
            size="medium" 
            variant="contained" 
            color="primary"
          >
            Create Order
          </Button>
        }
      />
    </PageContainer>
  );
}
