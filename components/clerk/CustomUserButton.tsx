// Alternate approach for older Clerk versions (no asChild support)
import { UserButton, useUser } from '@clerk/nextjs';


export const CustomUserButtonFallback = () => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return null;
    }

    const displayName = user?.firstName || user?.username || 'My Account';
    console.log(user);
    return (
        
        <div 
            className="flex items-center space-x-2 px-3 py-1.5 text-white 
                   transition"
        >
            
            <UserButton  
              
                
                appearance={{
                    elements: {
                        userButtonAvatarBox: {
                            
                            width: '30px',
                            height: '30px',
                        },
                        
                        userButtonPopoverCard: {
                            backgroundColor: "blue", 
                            
                            border: '2px solid #E32636',
                        },
                    },
                }}
            />
            {/* {user?.fullName} */}
        </div>
    );
};