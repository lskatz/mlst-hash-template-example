#!/usr/bin/env perl 

use warnings;
use strict;
use Data::Dumper;
use Getopt::Long;
use File::Basename qw/basename/;

use version 0.77;
our $VERSION="0.4";

local $0 = basename $0;
sub logmsg{local $0=basename $0; print STDERR "$0: @_\n";}
exit(main());

sub main{
  my $settings={};
  GetOptions($settings,qw(help out=s)) or die $!;
  usage() if(!@ARGV || $$settings{help});

  my($dir) = @ARGV;
  if(@ARGV>1){
    logmsg "WARNING: only one dir at a time is supported. Only reading $dir";
  }
  addProfilesFile($dir, $settings);

  return 0;
}

sub addProfilesFile{
    my($dir, $settings) = @_;

    my $alleles = "$dir/alleles.tsv";
    my $isolates= "$dir/isolates.tsv";
    my $profiles= "$dir/profiles.tsv";

    my $allelesMap = mapAllelesToHashes($alleles, $settings);
    # => the keys for allelesMap should also be column names in isolates.tsv for loci

    open(my $profilesFh, ">", $profiles) or die "ERROR: could not write to $profiles: $!";
    open(my $isolatesFh, "<", $isolates) or die "ERROR: could not read from $isolates: $!";
    my $header = <$isolatesFh>;
    chomp($header);
    my @header = split(/\t/, $header);
    my $numFields = @header;

    print $profilesFh $header."\n";
    
    while(my $line = <$isolatesFh>){
        my @F = split(/\t/, $line);
        my $profileLine = "";
        for(my $i=0;$i<$numFields;$i++){
            $F[$i] //= "";
            my $value = $F[$i];
            if($$allelesMap{$header[$i]}){
                # I noticed that some alleles might be semicolon separated (multiple loci per genome?)
                # and so as a shortcut I will just accept the first.
                $F[$i] =~ s/;.*//;
                
                $value = $$allelesMap{$header[$i]}{$F[$i]} || "NOVEL-$F[$i]";
                if(!$F[$i]){
                    $value = "";
                }
            }
            $profileLine .= "$value\t";
        }
        $profileLine =~ s/\t$//;
        print $profilesFh $profileLine;
    }
    close $isolatesFh;
    close $profilesFh;
}

sub mapAllelesToHashes{
    my($alleles, $settings) = @_;

    my %map;

    open(my $fh, $alleles);
    while(<$fh>){
        next if(/^#/);
        my($locus, $hash, $hashType, $attributes) = split /\t/;
        my %attribute;
        for my $attr(split(/;/, $attributes)){
            my($key, $value) = split(/=/, $attr);
            $attribute{$key} = $value;
        }
        $map{$locus}{$attribute{was}} = $hash;
    }
    close $fh;

    return \%map;
}

sub usage{
    print "Makes a profiles.tsv in a hash alleles directory. The directory must include alleles.tsv and isolates.tsv.
    Usage: $0 alleles
    ";
    exit 0;
}