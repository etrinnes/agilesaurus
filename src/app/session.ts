export interface VotingSession{
    userCount: number;
    voteCount: number;
    isActive: boolean;
    votes: VoteModel[];
}

export interface VoteModel{
    point: string;
    votes: number;
}

export interface VoteOption{
    id: string;
    title?: string;
    imagePath?: string;
    description?: string;
    style?: string;
}

export enum VoteType{
    Fib = "fib",
    Dinos = "dinos",
    Incr = "incremental",
    TShirt = "tshirt"
}

