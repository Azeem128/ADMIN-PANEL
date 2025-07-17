export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      admin: {
        Row: {
          adminid: string;
          email: string;
          createdat: string;
          updatedat: string;
          profileimage: string | null;
          name: string | null;
          password: string | null;
        };
        Insert: {
          adminid: string;
          email: string;
          createdat?: string;
          updatedat?: string;
          profileimage?: string | null;
          name?: string | null;
          password?: string | null;
        };
        Update: {
          adminid?: string;
          email?: string;
          createdat?: string;
          updatedat?: string;
          profileimage?: string | null;
          name?: string | null;
          password?: string | null;
        };
      };
    };
  };
}