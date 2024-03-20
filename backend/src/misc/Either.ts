export type Either<T, U> = Exclude<T, U> | Exclude<U, T>
