import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfilePage = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePicture, setProfilePicture] = useState(
        user?.profilePicture || ''
    );

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    useEffect(() => {
        if (user) {
            setName(`${user?.first_name} ${user.last_name}`);
            setEmail(user?.email);
            setUsername(user?.username || '');
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // updateProfile({ name, email, profilePicture });
        alert('Profile updated successfully!');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                        Manage your account settings and profile
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center mb-6">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={profilePicture} alt={name} />
                            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                {name ? getInitials(name) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="user_name"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profilePicture">
                                Profile Picture URL
                            </Label>
                            <Input
                                id="profilePicture"
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                value={profilePicture}
                                onChange={(e) =>
                                    setProfilePicture(e.target.value)
                                }
                            />
                            <p className="text-sm text-muted-foreground">
                                Enter a URL to your profile picture
                            </p>
                        </div>
                        <Button type="submit" className="w-full">
                            Update Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
